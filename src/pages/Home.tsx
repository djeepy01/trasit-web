import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
// import PartnersStrip from '../components/PartnersStrip';
import MainProduct from '../components/MainProduct';
import RiskCards from '../components/RiskCards';
import Stats from '../components/Stats';
import Dashboard from '../components/Dashboard';
import MessageSection from '../components/MessageSection';
import Domains from '../components/Domains';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

/**
 * Accueil : toutes les sections marketing + défilement doux vers les ancres (#how-it-works, #footer, etc.)
 */
export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const id = location.hash.replace(/^#/, '');
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <div style={{ fontSize: '20px' }}>
      <Hero />
      {/* <PartnersStrip /> */}
      <MainProduct />
      <RiskCards />
      <Stats />
      <Dashboard />
      <MessageSection />
      <Domains />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
