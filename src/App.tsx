import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';

function App() {
  return (
    <BrowserRouter>
      <div className="font-inter overflow-x-hidden min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nos-services" element={<ServicesPage />} />
          <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
