import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      school: formData.get('school'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Could not reach the server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-paper border-t border-ink/5">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl text-ink">Get in touch</h2>
          <p className="text-xl text-ink/60 font-serif">
            Interested in bringing Arwright to your school? <br className="hidden md:block" />
            Join our pilot program for the upcoming academic year.
          </p>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 bg-stone-50 rounded-3xl border border-ink/10 flex flex-col items-center gap-4"
          >
            <CheckCircle2 className="w-12 h-12 text-ink" />
            <h3 className="font-serif text-2xl font-medium text-ink">Thank you.</h3>
            <p className="text-ink/60">We've received your inquiry and will reach out shortly.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm font-medium text-ink/40 hover:text-ink transition-colors underline underline-offset-4"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="bg-paper p-8 md:p-12 rounded-3xl border border-ink/10 shadow-2xl shadow-ink/5 space-y-6 text-left"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-ink/40">Full Name</label>
                <input 
                  required
                  name="name"
                  type="text" 
                  className="w-full px-4 py-3 bg-stone-50 border border-ink/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-ink/40">School Email</label>
                <input 
                  required
                  name="email"
                  type="email" 
                  className="w-full px-4 py-3 bg-stone-50 border border-ink/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                  placeholder="j.doe@school.edu"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-ink/40">School / District Name</label>
              <input 
                required
                name="school"
                type="text" 
                className="w-full px-4 py-3 bg-stone-50 border border-ink/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                placeholder="Arwright Academy"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-ink/40">How can we help?</label>
              <textarea 
                required
                name="message"
                rows={4}
                className="w-full px-4 py-3 bg-stone-50 border border-ink/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
                placeholder="Tell us about your school's writing goals..."
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent text-paper rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-ink/30 italic font-serif">
              By submitting, you agree to our academic privacy standard.
            </p>
          </motion.form>
        )}
      </div>
    </section>
  );
}
