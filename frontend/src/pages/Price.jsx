import { useEffect, useState } from 'react';

export default function Price() {
    const [price, setPrice] = useState(null);

    useEffect(() => {
        // Function to fetch price
        const fetchPrice = () => {
            fetch('http://localhost:5000/price')
                .then(res => res.json())
                .then(data => setPrice(data))
                .catch(() => setPrice({ BTC: 'Error', ETH: 'Error' }));
        };

        // Fetch immediately on mount
        fetchPrice();

        // Then set up interval every 10 seconds
        const interval = setInterval(fetchPrice, 10000); // 10000 ms = 10 sec

        // Clean up when component unmounts
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Live Prices</h1>
            {price ? (
                <>
                    <p>BTC: ${price.BTC}</p>
                    <p>ETH: ${price.ETH}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
