export default function findKey(keyHolder) {
	const keyLocation = keyHolder.split('').findIndex((char) => char === ':');
	return keyHolder.slice(keyLocation + 2);
}
