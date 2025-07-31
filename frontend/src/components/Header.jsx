import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="header">
            <Link to="/">Home</Link> |{" "}
            <Link to="/price">Price</Link> |{" "}
            <Link to="/predict">Predict</Link> |{" "}
            <Link to="/sentiment">Sentiment</Link>
        </div>
    );
}

export default Header;
