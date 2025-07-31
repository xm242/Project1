import Header from './Header';
import Footer from './Footer';
import './DashboardShell.css';

function DashboardShell({ children }) {
    return (
        <div className="dashboard">
            <Header />
            <div className="dashboard-content">
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default DashboardShell;