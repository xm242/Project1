// Predict.jsx
import { useEffect, useState } from 'react';

export default function Predict() {
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/predict')
            .then(res => res.json())
            .then(data => setPrediction(data.prediction))
            .catch(err => setPrediction("Error fetching prediction"));
    }, []);

    return (
        <div>
            <h2>Predict Page</h2>
            <p>Prediction: {prediction ?? "Loading..."}</p>
        </div>
    );
}