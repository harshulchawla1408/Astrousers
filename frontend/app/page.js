'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error fetching message:', err));
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Message from Backend:</h1>
      <p>{message || 'Loading...'}</p>
    </main>
  );
}
