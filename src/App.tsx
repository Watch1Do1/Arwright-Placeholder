/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import LegalPage from './components/LegalPage';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="bg-paper min-h-screen selection:bg-accent selection:text-paper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<LegalPage title="Privacy Policy" />} />
          <Route path="/terms" element={<LegalPage title="Terms of Service" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Analytics />
      </div>
    </Router>
  );
}
