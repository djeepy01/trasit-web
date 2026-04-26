import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import Dashboard from './pages/Dashboard';
import FicheMission from './pages/FicheMission';
import RapportMission from './pages/RapportMission';
import CguPage from './pages/CguPage';
import ConfidentialitePage from './pages/ConfidentialitePage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="font-inter overflow-x-hidden min-h-screen">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fiche-mission" element={<FicheMission />} />
          <Route path="/rapport/:id" element={<RapportMission />} />

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/nos-services" element={<ServicesPage />} />
            <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/cgu" element={<CguPage />} />
            <Route path="/confidentialite" element={<ConfidentialitePage />} />
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
