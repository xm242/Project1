// Sentiment.jsx
import { useEffect, useState } from 'react';

export default function Sentiment() {
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    const [source, setSource] = useState('reddit'); // or 'coindesk'
    const API = `http://localhost:5000/sentiment?source=${source}&limit=20`;

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setErr(null);
                const res = await fetch(API);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (!cancelled) setData(json);
            } catch (e) {
                if (!cancelled) setErr(e.message);
            }
        };

        load();
        const id = setInterval(load, 1000 * 60); // refresh every minute
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [API]);

    return (
        <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
            <h1>Market Sentiment</h1>

            <div style={{ marginBottom: 12 }}>
                <label style={{ marginRight: 8 }}>Source:</label>
                <select value={source} onChange={(e) => setSource(e.target.value)}>
                    <option value="reddit">Reddit (r/CryptoCurrency)</option>
                    <option value="coindesk">CoinDesk (experimental)</option>
                </select>
            </div>

            {err && <p style={{ color: 'crimson' }}>Error: {err}</p>}
            {!data && !err && <p>Loading sentiment...</p>}

            {data && (
                <>
                    <div
                        style={{
                            background: '#fff',
                            padding: 16,
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            marginBottom: 24
                        }}
                    >
                        <h2 style={{ marginTop: 0 }}>Index: {data.index}/100</h2>
                        <div style={{ height: 16, background: '#eee', borderRadius: 8, overflow: 'hidden' }}>
                            <div
                                style={{
                                    width: `${data.index}%`,
                                    height: '100%',
                                    background:
                                        data.index >= 70
                                            ? '#22c55e'
                                            : data.index >= 60
                                                ? '#84cc16'
                                                : data.index >= 40
                                                    ? '#facc15'
                                                    : data.index >= 30
                                                        ? '#f97316'
                                                        : '#ef4444',
                                    transition: 'width 400ms ease'
                                }}
                            />
                        </div>
                        <p style={{ marginTop: 8 }}>
                            {data.label} &nbsp;•&nbsp; Avg polarity: {data.avg_polarity.toFixed(3)}
                        </p>
                        <small style={{ color: '#666' }}>
                            Source: {data.source} • Fetched: {new Date(data.fetched_at).toLocaleString()}
                        </small>
                    </div>

                    <h3>Headlines</h3>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {data.headlines.map((h, i) => {
                            const p = h.polarity;
                            const color =
                                p >= 0.2 ? '#22c55e' : p > -0.2 ? '#737373' : '#ef4444';
                            return (
                                <li
                                    key={i}
                                    style={{
                                        background: '#fff',
                                        marginBottom: 8,
                                        padding: 12,
                                        borderRadius: 8,
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>{h.title}</div>
                                    <div style={{ color }}>
                                        Polarity:&nbsp;{p.toFixed(3)}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}
