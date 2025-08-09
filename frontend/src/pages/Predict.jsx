// Predict.jsx
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Predict() {
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/predict')
            .then(res => res.json())
            .then(setData)
            .catch(() => setErr('Failed to load prediction'));
    }, []);

    if (err) return <p style={{ color: 'crimson' }}>{err}</p>;
    if (!data) return <p>Loading prediction…</p>;

    // Build chart datasets: history + next prediction
    const labels = [...data.labels, data.nextLabel];
    const historyWithNullNext = [...data.history, null];

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Historical (last 30 days)',
                data: historyWithNullNext,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79,70,229,0.15)',
                pointRadius: 2,
                tension: 0.2,
            },
            {
                label: 'Next-day Prediction',
                data: [
                    ...Array(data.history.length).fill(null),
                    data.prediction
                ],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16,185,129,0.15)',
                pointRadius: 4,
                borderDash: [6, 6],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true },
            tooltip: { mode: 'index', intersect: false },
        },
        interaction: { mode: 'index', intersect: false },
        scales: {
            x: { grid: { display: false } },
            y: { ticks: { callback: v => `$${v.toFixed(0)}` } },
        },
    };

    return (
        <div className="container">
            <h1>Next-Day Price Prediction</h1>
            <div style={{ maxWidth: 900, background: 'rgba(255,255,255,0.04)', padding: 16, borderRadius: 12 }}>
                <Line data={chartData} options={chartOptions} />
            </div>

            <p style={{ marginTop: 12 }}>
                Predicted next price: <strong>${data.prediction.toFixed(2)}</strong>
            </p>
        </div>
    );
}