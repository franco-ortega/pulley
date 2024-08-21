'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
	const [data, setData] = useState(null);
	const [display, setDisplay] = useState(null);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		const URL = '/api/proxy';

		try {
			const res = await fetch(URL);
			const result = await res.json();

			if (res.ok) {
				setData(result.data);
				setError(null);
			} else {
				setData(result.partialData);
				setError(result.error);
			}
		} catch (err) {
			console.error('Network error:', err);
			setError('Network error occurred');
			setData(null); // Clear data on network error
		}
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
					<li>
						<span>Level</span>: {display.level}
					</li>
				</ul>
			) : (
				'Click button to fetch data.'
			)}
		</main>
	);
}
