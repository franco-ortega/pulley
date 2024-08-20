export const dynamic = 'force-static';

const BASE_URL = 'https://ciphersprint.pulley.com';
const EMAIL = 'francoortegadev@gmail.com';

const updateUrlSegment = (data) => {
	const encryptionMethod = data.encryption_method;
	const encryptedPath = data.encrypted_path;

	switch (encryptionMethod) {
		case 'nothing':
			return encryptedPath;

		case 'encoded as base64':
			const encrytpedUrlSegment = encryptedPath.slice(5);
			const decrytpedUrlSegment = atob(encrytpedUrlSegment);
			const newUrlSegment = `task_${decrytpedUrlSegment}`;
			return newUrlSegment;

		default:
			return 'DEAD_END';
	}
};

const goDownTheRabbitHole = async (urlSegment, data, count = 0) => {
	console.log(`Going down ${count} times`);

	if (urlSegment === 'DEAD_END') return data;

	count++;

	const url = `${BASE_URL}/${urlSegment}`;

	const res = await fetch(url);

	const gold = await res.json();
	const newChunk = updateUrlSegment(gold);
	return await goDownTheRabbitHole(newChunk, gold, count);
};

export async function GET() {
	const data = await goDownTheRabbitHole(EMAIL, {}, 0);

	return Response.json({ data });
}
