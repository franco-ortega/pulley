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
		charsList[i] = nextChar;
		charsList[i + 1] = currentChar;
	}

	return charsList.join('');
};

const addToAcsii = (chars, num) => {
	const charsList = chars
		.split('')
		.map((char) => {
			return char.charCodeAt(0) - num;
		})
		.map((char) => String.fromCharCode(char));

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
			if (encryptionMethod.includes('ASCII value')) {
				const number = Number(encryptionMethod.slice(5, 8));
				const acsiiUrlSegment = addToAcsii(clippedUrlSegment, number);
				return `task_${acsiiUrlSegment}`;
			}

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

	console.log({ updatedUrlSegment });

	if (updatedUrlSegment === 'DEAD_END') return res;

	return await goDownTheRabbitHole(updatedUrlSegment);
};

export async function GET() {
	const data = await goDownTheRabbitHole(EMAIL);

	return Response.json({ data });
}
