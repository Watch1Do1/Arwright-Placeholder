import { motion } from 'motion/react';
import { Feather } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-paper/80 backdrop-blur-md border-b border-ink/5"
    >
      <a href="#" className="flex items-center gap-3">
        <img src="/logo.PNG" alt="Arwright Logo" className="w-8 h-8 object-contain" />
        <span className="font-serif text-2xl font-semibold tracking-tight text-ink">Arwright</span>
      </a>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/60">
        <a href="#features" className="hover:text-accent transition-colors">Features</a>
        <a href="#students" className="hover:text-accent transition-colors">For Students</a>
        <a href="#teachers" className="hover:text-accent transition-colors">For Teachers</a>
        <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
      </div>

      <a 
        href="#contact"
        className="px-5 py-2 text-xs font-medium uppercase tracking-widest bg-accent text-paper rounded-full border border-accent hover:bg-transparent hover:text-accent transition-all duration-300"
      >
        Inquire
      </a>
    </motion.nav>
  );
}
