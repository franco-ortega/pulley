export const dynamic = 'force-static';

export async function GET(bundle) {
	console.log(bundle);

	const res = await fetch(
		'https://ciphersprint.pulley.com/francoortegadev@gmail.com',
		{
			headers: {
				'Content-Type': 'application/json',
				'API-Key': process.env.DATA_API_KEY,
			},
		}
	);
	const data = await res.json();

	return Response.json({ data });
}
