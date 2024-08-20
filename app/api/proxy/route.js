export const dynamic = 'force-static';

const BASE_URL = 'https://ciphersprint.pulley.com';
const EMAIL = 'francoortegadev@gmail.com';

const updateUrl = (data) => {
	if (data.encryption_method === 'encoded as base64') {
		const chunk = path.slice(5);
		console.log({ chunk });
		const decodedChunk = btoa(chunk);
		console.log({ decodedChunk });
		const newPath = `task_${decodedChunk}`;
		return newPath;
	}

	return data.encrypted_path;
};

export async function GET() {
	const res = await fetch(`${BASE_URL}/${EMAIL}`, {
		headers: {
			'Content-Type': 'application/json',
			'API-Key': process.env.DATA_API_KEY,
		},
	});

	const firstData = await res.json();

	const NEXT_PATH = updateUrl(firstData);

	console.log({ NEXT_PATH });

	const newRes = await fetch(`${BASE_URL}/${NEXT_PATH}`, {
		headers: {
			'Content-Type': 'application/json',
			'API-Key': process.env.DATA_API_KEY,
		},
	});

	const data = await newRes.json();

	console.log({ data });

	return Response.json({ data });
}
