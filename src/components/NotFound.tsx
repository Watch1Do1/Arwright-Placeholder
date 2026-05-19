import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <span className="inline-block px-3 py-1 bg-ink/5 text-ink/40 text-[10px] font-medium tracking-[0.2em] uppercase rounded-full mb-6">
          Error 404
        </span>
        
        <h1 className="text-4xl font-serif text-ink mb-4 italic">
          Path not found
        </h1>
        
        <p className="text-ink/60 text-sm leading-relaxed mb-10">
          The page you are looking for doesn't exist or has been moved to a different location. 
          Let's get you back to the right path.
        </p>

        <a 
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-paper rounded-xl font-medium text-sm hover:scale-105 transition-transform duration-300 shadow-xl shadow-accent/10"
        >
          <ArrowLeft size={16} />
          Back to Arwright
        </a>
      </motion.div>
    </div>
  );
}
