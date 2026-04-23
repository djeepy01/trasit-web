import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';

function App() {
  return (
    <BrowserRouter>
      <div className="font-inter overflow-x-hidden min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nos-services" element={<ServicesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
