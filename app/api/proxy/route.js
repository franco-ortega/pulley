import findKey from '@/utils/findKey';
import logCount from '@/utils/logCount';

export const dynamic = 'force-static';

const BASE_URL = 'https://ciphersprint.pulley.com';
const EMAIL = 'francoortegadev@gmail.com';

const collectedData = [];

const swapCharacters = (chars) => {
	let swappedChars = '';

	for (let i = 0; i <= chars.length - 2; i += 2) {
		const currentChar = chars[i];
		const nextChar = chars[i + 1];

		swappedChars = swappedChars + nextChar + currentChar;
	}

	return swappedChars;

	// return charsList.join('');
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

const decodeMessagePack = (encryptedString, keyHolder) => {
	const base64String = findKey(keyHolder);

	function base64ToUint8Array(base64) {
		const binaryString = atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);

		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		return bytes;
	}

	const binaryData = base64ToUint8Array(base64String);

	function decodeMessagePack(data) {
		const positions = [];
		let i = 0;

		while (i < data.length) {
			let value = data[i++];
			if (value < 0x80) {
				// Single byte integer
				positions.push(value);
			} else if (value === 0xc2) {
				// MessagePack format for 16-bit integers
				value = (data[i] << 8) | data[i + 1];
				positions.push(value);
				i += 2;
			}
		}

		return positions;
	}

	const positions = decodeMessagePack(binaryData);

	function reorderString(str, positions) {
		const arr = Array.from(str);
		const reordered = Array(arr.length);

		for (let i = 0; i < positions.length; i++) {
			reordered[positions[i]] = arr[i];
		}

		return reordered.join('');
	}

	const answer = reorderString(encryptedString, positions);

	return answer;
};

const updateUrlSegment = (encryptionMethod, encryptedUrlSegment) => {
	const clippedUrlSegment = encryptedUrlSegment.slice(5);

	switch (encryptionMethod) {
		case 'nothing':
			return encryptedUrlSegment;

		case 'encoded as base64':
			return `task_${atob(clippedUrlSegment)}`;

		case 'swapped every pair of characters':
			return `task_${swapCharacters(clippedUrlSegment)}`;

		case 'hex decoded, encrypted with XOR, hex encoded again. key: secret':
			return `task_${decodeHex(clippedUrlSegment, encryptionMethod)}`;

		default:
			if (encryptionMethod.includes('ASCII value')) {
				const number = Number(encryptionMethod.slice(5, 8));
				return `task_${addToAcsii(clippedUrlSegment, number)}`;
			}

			if (encryptionMethod.includes('scrambled!')) {
				return `task_${decodeMessagePack(clippedUrlSegment, encryptionMethod)}`;
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

	collectedData.unshift(res);

	const updatedUrlSegment = updateUrlSegment(
		res.encryption_method,
		res.encrypted_path
	);

	if (updatedUrlSegment === 'DEAD_END') return res;

	return await goDownTheRabbitHole(updatedUrlSegment);
};

export async function GET() {
	collectedData.length = 0;

	try {
		const data = await goDownTheRabbitHole(EMAIL);
		return Response.json({ data });
	} catch (error) {
		console.error('Error fetching data:', error);

		return new Response(
			JSON.stringify({
				error: 'Failed to fetch all data',
				partialData: collectedData,
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
