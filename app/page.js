'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
	const [data, setData] = useState(null);

	useEffect(() => {
		const URL = '/api/proxy';

		fetch(URL)
			.then((res) => res.json())
			.then((res) => setData(res.data));
	}, []);

	console.log(data);

	return (
		<main className={styles.main}>
			{data ? (
				<ul>
					<li>Path: {data.encrypted_path}</li>
					<li>Method: {data.encryption_method}</li>
					<li>Expires: {data.expires_in}</li>
					<li>Instructions: {data.instructions}</li>
				</ul>
			) : (
				'Loading....'
			)}
		</main>
	);
}
