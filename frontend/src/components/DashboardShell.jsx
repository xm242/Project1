import Header from './Header';
import Footer from './Footer';

export default function DashboardShell({ children }) {
    return (
        <div>
            <Header />
            <main style={{ padding: '2rem' }}>{children}</main>
            <Footer />
        </div>
    );
}