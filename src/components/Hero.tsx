import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2070" 
          alt="Clean writing desk" 
          className="w-full h-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] uppercase tracking-[0.2em] font-medium border border-accent/20 rounded-full text-accent">
            Evolution of Writing
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.9] text-ink">
            Writing with <br />
            <span className="italic text-accent">Process Transparency</span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-ink/70 font-serif leading-relaxed"
        >
          Arwright is a school-based writing platform designed to help students develop authentic writing skills in the age of AI. Focusing on <span className="text-ink">how</span> writing is created—not just the final product.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <a 
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 bg-accent text-paper rounded-xl font-medium text-sm hover:scale-105 transition-transform duration-300 shadow-xl shadow-accent/10"
          >
            Bring Arwright to your school
          </a>
          <a 
            href="#features"
            className="w-full sm:w-auto px-8 py-4 border border-ink/10 text-ink rounded-xl font-medium text-sm hover:bg-ink/5 transition-colors"
          >
            Learn more
          </a>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10"
      >
        <ArrowDown className="w-5 h-5 text-ink/30" />
      </motion.div>
    </section>
  );
}
