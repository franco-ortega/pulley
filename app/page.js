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
			{error && <div>(Error: {error})</div>}
			{display ? (
				<ul>
					{display.map((entry) => (
						<ol key={entry.level}>
							<li>
								<span>Path</span>: {entry.encrypted_path}
							</li>
							<li>
								<span>Method</span>: {entry.encryption_method}
							</li>
							<li>
								<span>Expires</span>: {entry.expires_in}
							</li>
							<li>
								<span>Instructions</span>: {entry.instructions}
							</li>
							<li>
								<span>Level</span>: {entry.level}
							</li>
						</ol>
					))}
				</ul>
			) : (
				<div>Click button to fetch data.</div>
			)}
		</main>
	);
}
