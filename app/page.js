'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
	const [data, setData] = useState(null);
	const [display, setDisplay] = useState(null);

	const fetchData = () => {
		const URL = '/api/proxy';

		fetch(URL)
			.then((res) => res.json())
			.then((res) => setData(res.data));
	};

	useEffect(() => {
		setDisplay(data);
	}, [data]);

	console.log(data);

	return (
		<main className={styles.main}>
			<div>
				<button onClick={fetchData}>Fetch Data</button>
			</div>
			{display ? (
				<ul>
					<li>
						<span>Path</span>: {display.encrypted_path}
					</li>
					<li>
						<span>Method</span>: {display.encryption_method}
					</li>
					<li>
						<span>Expires</span>: {display.expires_in}
					</li>
					<li>
						<span>Instructions</span>: {display.instructions}
					</li>
				</ul>
			) : (
				'Click button to fetch data.'
			)}
		</main>
	);
}
