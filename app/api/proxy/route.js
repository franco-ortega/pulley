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

const goDownTheRabbitHole = async (urlSegment, data) => {
	if (urlSegment === 'DEAD_END') return data;

	const url = `${BASE_URL}/${urlSegment}`;

	const res = await fetch(url).then((res) => res.json());

	console.log(`Going down ${res.level + 1} times`);

	const updatedUrlSegment = updateUrlSegment(res);

	return await goDownTheRabbitHole(updatedUrlSegment, res);
};

export async function GET() {
	const data = await goDownTheRabbitHole(EMAIL);

	return Response.json({ data });
}
