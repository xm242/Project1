import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Price from './pages/Price';
import Predict from './pages/Predict';
import Sentiment from './pages/Sentiment';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/price" element={<Price />} />
                <Route path="/predict" element={<Predict />} />
                <Route path="/sentiment" element={<Sentiment />} />
            </Routes>
        </Router>
    );
}

export default App;