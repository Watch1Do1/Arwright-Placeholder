/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-paper min-h-screen selection:bg-brand-blue selection:text-ink">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
