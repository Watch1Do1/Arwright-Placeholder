import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { SHOW_DEMO_CTA, DEMO_URL, APP_URL } from '../config';

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
          <span className="text-ink">See the thinking behind the writing, not just the final product.</span> Students learn to write with an AI coach that guides their thinking without writing their essays for them. Teachers can see how each piece develops, from revisions to reflection, so they can better understand the work behind the words.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {SHOW_DEMO_CTA && (
            <a
              href={DEMO_URL}
              className="w-full sm:w-auto px-8 py-3 bg-ink text-paper rounded-xl hover:scale-105 transition-transform duration-300 text-center"
            >
              <span className="block font-medium text-sm">Try the Demo</span>
              <span className="block text-xs text-paper/60">See Arwright in action</span>
            </a>
          )}
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-3 bg-accent text-paper rounded-xl hover:scale-105 transition-transform duration-300 shadow-xl shadow-accent/10 text-center"
          >
            <span className="block font-medium text-sm">Explore a Pilot</span>
            <span className="block text-xs text-paper/70">See if it fits your school</span>
          </a>
          <a
            href={APP_URL}
            className="w-full sm:w-auto px-8 py-3 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl hover:bg-secondary/20 transition-all duration-300 text-center"
          >
            <span className="block font-medium text-sm">Launch App</span>
            <span className="block text-xs text-secondary/70">Sign in to Arwright</span>
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
