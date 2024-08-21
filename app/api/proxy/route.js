export const dynamic = 'force-static';

const BASE_URL = 'https://ciphersprint.pulley.com';
const EMAIL = 'francoortegadev@gmail.com';

const logCount = (level) => {
	console.log(`Going down ${level + 1} times`);
};

const swapCharacters = (chars) => {
	const charsList = chars.split('');

	for (let i = 0; i <= charsList.length - 1; i += 2) {
		const currentChar = charsList[i];
		const nextChar = charsList[i + 1];
		console.log(i, currentChar, nextChar);
		charsList[i] = nextChar;
		charsList[i + 1] = currentChar;
	}

	return charsList.join('');
};

const updateUrlSegment = (encryptionMethod, encryptedUrlSegment) => {
	const clippedUrlSegment = encryptedUrlSegment.slice(5);

	switch (encryptionMethod) {
		case 'nothing':
			return encryptedUrlSegment;

		case 'encoded as base64':
			const decryptedUrlSegment = atob(clippedUrlSegment);
			return `task_${decryptedUrlSegment}`;

		case 'swapped every pair of characters':
			const swappedUrlSegment = swapCharacters(clippedUrlSegment);
			return `task_${swappedUrlSegment}`;

		default:
			return 'DEAD_END';
	}
};

const goDownTheRabbitHole = async (urlSegment) => {
	const res = await fetch(`${BASE_URL}/${urlSegment}`).then((res) =>
		res.json()
	);

	logCount(res.level);

	console.log(res);

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
