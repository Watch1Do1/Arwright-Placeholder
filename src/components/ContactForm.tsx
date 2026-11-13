import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Info } from 'lucide-react';
import { SELECT_INQUIRY_TYPE_EVENT } from './Homeschool';

type InquiryType = 'pilot_program' | 'homeschool_family';

const BETA_MIN_AGE = 13;

const inputClass =
  'w-full px-4 py-3 bg-stone-50 border border-ink/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all';
const labelClass = 'text-[10px] uppercase tracking-widest font-semibold text-ink/40';

// True when the ages text contains a number under 13 (used only for the gentle beta note;
// the server does the real validation).
const mentionsUnder13 = (agesText: string) =>
  (agesText.match(/\d+/g) || []).some((n) => parseInt(n, 10) < BETA_MIN_AGE);

export default function ContactForm() {
  const [inquiryType, setInquiryType] = useState<InquiryType>('pilot_program');
  const [studentAges, setStudentAges] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHomeschool = inquiryType === 'homeschool_family';
  const showUnder13Note = isHomeschool && mentionsUnder13(studentAges);

  // The "Join the founding family beta" button in the For Families section selects the homeschool form
  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail === 'homeschool_family' || detail === 'pilot_program') {
        setInquiryType(detail);
        setSubmitted(false);
        setError(null);
      }
    };
    window.addEventListener(SELECT_INQUIRY_TYPE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_INQUIRY_TYPE_EVENT, onSelect);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = isHomeschool
      ? {
          type: 'homeschool_family',
          name: formData.get('name'),
          email: formData.get('email'),
          school: formData.get('school'),
          studentCount: formData.get('studentCount'),
          studentAges: formData.get('studentAges'),
          foundingFamily: formData.get('foundingFamily') === 'on',
          message: formData.get('message'),
        }
      : {
          type: 'pilot_program',
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
        setStudentAges('');
        setLoading(false);
      } else {
        const result = await response.json().catch(() => null);
        setError(
          result?.error ||
            "We couldn't send your inquiry. Please email hello@arwrightlearning.com."
        );
        setLoading(false);
      }
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const typeButtonClass = (active: boolean) =>
    `flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active ? 'bg-ink text-paper shadow-sm' : 'text-ink/60 hover:text-ink'
    }`;

  return (
    <section id="contact" className="py-24 px-6 bg-paper border-t border-ink/5">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="font-serif text-4xl md:text-6xl text-ink">Get in touch</h2>
          {isHomeschool ? (
            <p className="text-xl text-ink/60 font-serif">
              Homeschooling a writer 13 or older? <br className="hidden md:block" />
              Join the founding family beta and we'll set up your family account.
            </p>
          ) : (
            <p className="text-xl text-ink/60 font-serif">
              Interested in bringing Arwright to your school? <br className="hidden md:block" />
              Join our pilot program for the upcoming academic year.
            </p>
          )}
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
            <div className="space-y-2">
              <span id="inquiry-type-label" className={labelClass}>I'm asking about</span>
              <div
                role="radiogroup"
                aria-labelledby="inquiry-type-label"
                className="flex gap-2 p-1 bg-stone-50 border border-ink/5 rounded-2xl"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={!isHomeschool}
                  onClick={() => setInquiryType('pilot_program')}
                  className={typeButtonClass(!isHomeschool)}
                >
                  School pilot
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isHomeschool}
                  onClick={() => setInquiryType('homeschool_family')}
                  className={typeButtonClass(isHomeschool)}
                >
                  Homeschool family
                </button>
              </div>
            </div>

            {isHomeschool ? (
              <div key="homeschool" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="hs-name" className={labelClass}>Parent Name</label>
                    <input required id="hs-name" name="name" type="text" maxLength={200} className={inputClass} placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="hs-email" className={labelClass}>Email</label>
                    <input required id="hs-email" name="email" type="email" maxLength={254} className={inputClass} placeholder="jane@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="hs-family" className={labelClass}>Family Name (optional)</label>
                  <input id="hs-family" name="school" type="text" maxLength={200} className={inputClass} placeholder="The Doe Family" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="hs-count" className={labelClass}>Number of Students</label>
                    <select required id="hs-count" name="studentCount" defaultValue="1" className={inputClass}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5 or more</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="hs-ages" className={labelClass}>Each Student's Age</label>
                    <input
                      required
                      id="hs-ages"
                      name="studentAges"
                      type="text"
                      inputMode="numeric"
                      maxLength={100}
                      value={studentAges}
                      onChange={(e) => setStudentAges(e.target.value)}
                      aria-describedby={showUnder13Note ? 'hs-age-note' : undefined}
                      className={inputClass}
                      placeholder="Ages, e.g. 13, 15"
                    />
                  </div>
                </div>

                {showUnder13Note && (
                  <p
                    id="hs-age-note"
                    className="text-sm text-ink/70 bg-blue-50 border border-accent/10 rounded-xl px-4 py-3 flex items-start gap-2"
                  >
                    <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>
                      Just so you know, the homeschool beta is for students 13 and up. You're still welcome to send
                      this, and we'll follow up.
                    </span>
                  </p>
                )}

                <label className="flex items-start gap-3 text-sm text-ink/70 cursor-pointer">
                  <input
                    name="foundingFamily"
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-ink/20 accent-[var(--color-accent)]"
                  />
                  <span>Interested in being a founding family?</span>
                </label>

                <div className="space-y-2">
                  <label htmlFor="hs-message" className={labelClass}>How do you teach writing now? (optional)</label>
                  <textarea
                    id="hs-message"
                    name="message"
                    rows={4}
                    maxLength={5000}
                    className={`${inputClass} resize-none`}
                    placeholder="Curriculum you use, what your student is working on, questions for us..."
                  />
                </div>
              </div>
            ) : (
              <div key="pilot" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-ink/40">Full Name</label>
                    <input 
                      required
                      name="name"
                      type="text"
                      maxLength={200}
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
                      maxLength={254}
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
                    maxLength={200}
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
                    maxLength={5000}
                    className="w-full px-4 py-3 bg-stone-50 border border-ink/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
                    placeholder="Tell us about your school's writing goals..."
                  />
                </div>
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-center text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

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
              By submitting, you agree to our{' '}
              <Link to="/privacy" className="underline underline-offset-4 hover:text-ink transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </motion.form>
        )}
      </div>
    </section>
  );
}
