import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Price from './pages/Price';
import Predict from './pages/Predict';
import Sentiment from './pages/Sentiment';
import DashboardShell from './components/DashboardShell';

function App() {
    return (
        <Router>
            <DashboardShell>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/price" element={<Price />} />
                    <Route path="/predict" element={<Predict />} />
                    <Route path="/sentiment" element={<Sentiment />} />
                </Routes>
            </DashboardShell>
        </Router>
    );
}

export default App;