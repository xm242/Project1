import { useEffect, useState } from 'react';

export default function Price() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/price')
      .then(res => res.json())
      .then(data => setPrice(data.price));
  }, []);

  return (
    <div>
      <h2>Price Page</h2>
      <p>Current price: {price ?? "Loading..."}</p>
    </div>
  );
}