export const dynamic = 'force-static';

export async function GET() {
	const BASE_URL = 'https://ciphersprint.pulley.com';
	const EMAIL = 'francoortegadev@gmail.com';

	const updateUrlSegment = (data) => {
		const encryptionMethod = data.encryption_method;
		const encryptedPath = data.encrypted_path;

		switch (encryptionMethod) {
			case 'nothing':
				return encryptedPath;

			case 'encoded as base64':
				const encrytpedUrlSegment = encryptedPath.slice(5);
				const decrytpedUrlSegment = atob(encrytpedUrlSegment);
				const newUrlSegment = `task_${decrytpedUrlSegment}`;
				return newUrlSegment;

			default:
				return 'DEAD_END';
		}
	};

	const goDownTheRabbitHole = async (urlSegment, data, count = 0) => {
		console.log(`Going down ${count} times`);
		console.log(urlSegment === 'DEAD_END');
		console.log({ data });
		// console.log({ urlSegment });
		if (urlSegment === 'DEAD_END') return data;

		count++;
		// console.log({ urlSegment });
		// console.log({ data });

		const url = `${BASE_URL}/${urlSegment}`;
		// console.log({ url });

		const res = await fetch(url);

		const gold = await res.json();
		const newChunk = updateUrlSegment(gold);
		// return Response.json({ data });
		// console.log({ newChunk });

		// const test = Response.json({ data });
		// console.log({ test });

		return await goDownTheRabbitHole(newChunk, gold, count);
	};

	////////////

	const data = await goDownTheRabbitHole(EMAIL, {}, 0);

	// const res = await fetch(`${BASE_URL}/${EMAIL}`);

	// const firstData = await res.json();

	// const NEXT_PATH = updateUrlSegment(firstData);

	// const newRes = await fetch(`${BASE_URL}/${NEXT_PATH}`);

	// const secondData = await newRes.json();

	// const ANOTHER_PATH = updateUrlSegment(secondData);

	// const thirdRes = await fetch(`${BASE_URL}/${ANOTHER_PATH}`);

	// const data = await thirdRes.json();

	return Response.json({ data });
}
