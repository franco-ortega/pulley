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

const decodeHex = (encodedString, keyHolder) => {
	// hex
	// hex decoded
	// encrypt with XOR
	// hex encoded again

	// decode hex        -> HEX to STRING
	// decrypt with XOR  -> STRING decrypt
	// encode hex        -> STRING to HEX

	const keyLocation = keyHolder.split('').findIndex((char) => char === ':');
	const key = keyHolder.slice(keyLocation + 2);

	console.log({ key });

	// Step 1: Hex Decode
	function hexToBytes(hex) {
		let bytes = [];
		for (let c = 0; c < hex.length; c += 2) {
			bytes.push(parseInt(hex.substr(c, 2), 16));
		}

		// let bytes = '';
		// for (let i = 0; i < hex.length; i += 2) {
		// 	const hexValue = hex.substr(i, 2);
		// 	const decimalValue = parseInt(hexValue, 16);
		// 	bytes += String.fromCharCode(decimalValue);
		// }

		return bytes;
	}

	const decodedBytes = hexToBytes(encodedString);
	console.log({ decodedBytes });

	function xorDecrypt(bytes, key) {
		let decrypted = '';
		for (let i = 0; i < bytes.length; i++) {
			const keyCode = key.charCodeAt(i % key.length);
			const decryptedByte = bytes[i] ^ keyCode;
			console.log('KEY CODE: ', keyCode);
			console.log('BYTE: ', bytes[i]);
			console.log('DECRYPTED BYTE: ', decryptedByte);
			console.log('STRING: ', String.fromCharCode(decryptedByte));
			// decrypted += String.fromCharCode(decryptedByte);
			// const THING = String.fromCharCode(decryptedByte);
			// console.log({ THING });
			decrypted += decryptedByte.toString(16);
		}
		return decrypted;
	}

	const decryptedMessage = xorDecrypt(decodedBytes, key);

	console.log({ LLLLLLL: decryptedMessage }); // Output the decrypted message

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
			console.log(decodedUrlSegment);
			return `task_${decodedUrlSegment}`;

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
