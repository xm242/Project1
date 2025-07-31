// Sentiment.jsx
import { useEffect, useState } from 'react';

export default function Sentiment() {
    const [sentiment, setSentiment] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/sentiment')
            .then(res => res.json())
            .then(data => setSentiment(data.sentiment))
            .catch(err => setSentiment("Error fetching sentiment"));
    }, []);

    return (
        <div>
            <h2>Sentiment Page</h2>
            <p>Sentiment: {sentiment ?? "Loading..."}</p>
        </div>
    );
}