import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PartnersStrip from './components/PartnersStrip';
import MainProduct from './components/MainProduct';
import RiskCards from './components/RiskCards';
import Stats from './components/Stats';
import Dashboard from './components/Dashboard';
import Domains from './components/Domains';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-inter overflow-x-hidden">
      <Navbar />
      <Hero />
      <PartnersStrip />
      <MainProduct />
      <RiskCards />
      <Stats />
      <Dashboard />
      <Domains />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
