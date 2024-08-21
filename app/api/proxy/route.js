export const dynamic = 'force-static';

const BASE_URL = 'https://ciphersprint.pulley.com';
const EMAIL = 'francoortegadev@gmail.com';

const logCount = (level) => {
	console.log(`Going down ${level + 1} times`);
};

const updateUrlSegment = (encryptionMethod, encryptedUrlSegment) => {
	switch (encryptionMethod) {
		case 'nothing':
			return encryptedUrlSegment;

		case 'encoded as base64':
			const decryptedUrlSegment = atob(encryptedUrlSegment.slice(5));
			return `task_${decryptedUrlSegment}`;

		default:
			return 'DEAD_END';
	}
};

const goDownTheRabbitHole = async (urlSegment) => {
	const res = await fetch(`${BASE_URL}/${urlSegment}`).then((res) =>
		res.json()
	);

	logCount(res.level);

	const updatedUrlSegment = updateUrlSegment(
		res.encryption_method,
		res.encrypted_path
	);

	if (updatedUrlSegment === 'DEAD_END') return res;

	return await goDownTheRabbitHole(updatedUrlSegment);
};

export async function GET() {
	const data = await goDownTheRabbitHole(EMAIL);

	return Response.json({ data });
}
