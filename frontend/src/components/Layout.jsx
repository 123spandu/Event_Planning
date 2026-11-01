import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import WhatsAppFloat from './WhatsAppFloat.jsx';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
