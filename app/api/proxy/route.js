export const dynamic = 'force-static';

const BASE_URL = 'https://ciphersprint.pulley.com';
const EMAIL = 'francoortegadev@gmail.com';

const logCount = (level) => {
	console.log(`Going down ${level + 1} times`);
};

const findKey = (keyHolder) => {
	const keyLocation = keyHolder.split('').findIndex((char) => char === ':');
	return keyHolder.slice(keyLocation + 2);
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

const decodeHex = (encodedString, keyHolder) => {
	const key = findKey(keyHolder);

	function hexToBytes(hex) {
		let bytes = [];
		for (let c = 0; c < hex.length; c += 2) {
			bytes.push(parseInt(hex.substr(c, 2), 16));
		}

		return bytes;
	}

	const decodedBytes = hexToBytes(encodedString);

	function xorDecrypt(bytes, key) {
		let decrypted = '';
		for (let i = 0; i < bytes.length; i++) {
			const keyCode = key.charCodeAt(i % key.length);
			const decryptedByte = bytes[i] ^ keyCode;
			decrypted += decryptedByte.toString(16);
		}
		return decrypted;
	}

	const decryptedMessage = xorDecrypt(decodedBytes, key);

	return decryptedMessage;
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

		case 'hex decoded, encrypted with XOR, hex encoded again. key: secret':
			const decodedUrlSegment = decodeHex(clippedUrlSegment, encryptionMethod);
			return `task_${decodedUrlSegment}`;

		default:
			if (encryptionMethod.includes('ASCII value')) {
				const number = Number(encryptionMethod.slice(5, 8));
				const acsiiUrlSegment = addToAcsii(clippedUrlSegment, number);
				return `task_${acsiiUrlSegment}`;
			}

			if (encryptionMethod.includes('scrambled!')) {
				const messagePackSegment = decodeMessagePack(
					clippedUrlSegment,
					encryptionMethod
				);
				return `task_${messagePackSegment}`;
			}

			return 'DEAD_END';
	}
};

const goDownTheRabbitHole = async (urlSegment) => {
	const res = await fetch(`${BASE_URL}/${urlSegment}`).then((res) =>
		res.json()
	);

	logCount(res.level);

	console.log({ res });

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
