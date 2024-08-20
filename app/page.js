'use client';

import { NextResponse } from 'next/server';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
	const [data, setData] = useState();

	useEffect(() => {
		const STARTING_URL = '/api/proxy';

		fetch(STARTING_URL)
			.then((res) => res.json())
			.then((res) => setData(res));
	}, []);

	console.log(data);

	return <main className={styles.main}>TEST</main>;
}
