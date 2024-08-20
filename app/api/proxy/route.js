export const dynamic = 'force-static';

const BASE_URL = 'https://ciphersprint.pulley.com';
const EMAIL = 'francoortegadev@gmail.com';

const updateUrlSegment = (data) => {
	const encryptionMethod = data.encryption_method;
	const encryptedPath = data.encrypted_path;

	switch (encryptionMethod) {
		case 'nothing':
			console.log({ encryptedPath });
			return encryptedPath;

		case 'encoded as base64':
			const urlSegment = encryptedPath.slice(5);
			const decodedUrlSegment = atob(urlSegment);
			const newUrlSegment = `task_${decodedUrlSegment}`;

			console.log({ urlSegment });
			console.log({ decodedUrlSegment });
			console.log({ newUrlSegment });
			return newUrlSegment;

		default:
			console.log('dead end');
	}
};

export async function GET() {
	const res = await fetch(`${BASE_URL}/${EMAIL}`, {
		headers: {
			'Content-Type': 'application/json',
			'API-Key': process.env.DATA_API_KEY,
		},
	});

	const firstData = await res.json();

	const NEXT_PATH = updateUrlSegment(firstData);
	console.log({ firstData });

	const newRes = await fetch(`${BASE_URL}/${NEXT_PATH}`, {
		headers: {
			'Content-Type': 'application/json',
			'API-Key': process.env.DATA_API_KEY,
		},
	});

	const secondData = await newRes.json();

	const ANOTHER_PATH = updateUrlSegment(secondData);
	console.log({ secondData });

	const thirdRes = await fetch(`${BASE_URL}/${ANOTHER_PATH}`, {
		headers: {
			'Content-Type': 'application/json',
			'API-Key': process.env.DATA_API_KEY,
		},
	});

	const data = await thirdRes.json();

	console.log({ data });

	return Response.json({ data });
}
