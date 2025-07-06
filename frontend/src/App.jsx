import { useState } from 'react';

function App() {
    const [message, setMessage] = useState('');

    const callPing = async () => {
        try {
            const response = await fetch('http://localhost:5000/ping');
            const data = await response.json();
            setMessage(data.message);
        } catch (err) {
            setMessage('Error connecting to backend');
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>React + Flask Test</h1>
            <button onClick={callPing}>Call /ping</button>
            {message && <p>Response: {message}</p>}
        </div>
    );
}

export default App;