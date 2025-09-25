import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Container from './components/layout/Container';
import SecurityBanner from './components/SecurityBanner';
import LandingPage from './pages/LandingPage';
import SimpleLoginPage from './pages/SimpleLoginPage';
import RolePage from './pages/RolePage';
import SellerPage from './pages/SellerPage';
import BrokerPage from './pages/BrokerPage';
import BuyerPage from './pages/BuyerPage';
import ExplorerPage from './pages/ExplorerPage';
import AboutZKPage from './pages/AboutZKPage';

function App() {
  return (
    <Router>
      <div className="page-container">
        <SecurityBanner />
        <TopBar />
        <main className="py-8">
          <Container>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<SimpleLoginPage />} />
              <Route path="/signup" element={<SimpleLoginPage />} />
              <Route path="/role" element={<RolePage />} />
              <Route path="/seller" element={<SellerPage />} />
              <Route path="/broker" element={<BrokerPage />} />
              <Route path="/buyer" element={<BuyerPage />} />
              <Route path="/explorer" element={<ExplorerPage />} />
              <Route path="/about-zk" element={<AboutZKPage />} />
            </Routes>
          </Container>
        </main>
      </div>
    </Router>
  );
}

export default App;
