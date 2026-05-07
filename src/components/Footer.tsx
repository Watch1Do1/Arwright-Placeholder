import { Feather } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-paper border-t border-ink/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <img src="/logo.PNG" alt="Arwright Logo" className="w-6 h-6 object-contain" />
            <span className="font-serif text-xl font-semibold text-ink">Arwright</span>
          </div>
          <p className="text-xs text-ink/40 max-w-xs">
            A pedagogically aligned writing environment for the modern era. Preserving student voice and teacher insight.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest font-semibold text-ink/60">
          <a href="#" className="hover:text-brand-blue transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-blue transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-blue transition-colors">Accessibility</a>
          <a href="#" className="hover:text-brand-blue transition-colors">Support</a>
        </div>

        <div className="text-[10px] uppercase tracking-widest font-semibold text-ink/30">
          © {new Date().getFullYear()} Arwright Inc.
        </div>
      </div>
    </footer>
  );
}
