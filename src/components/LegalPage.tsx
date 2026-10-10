import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from './Footer';

interface LegalPageProps {
  title: string;
}

// Placeholder page for legal documents. The final text will replace the draft notice
// once it has been approved.
export default function LegalPage({ title }: LegalPageProps) {
  // Start at the top when arriving from a footer link
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <header className="px-6 py-4 border-b border-ink/5">
        <Link to="/" className="inline-flex items-center gap-3">
          <img src="/logo.PNG" alt="Arwright Logo" className="w-8 h-8 object-contain" />
          <span className="font-serif text-2xl font-semibold tracking-tight text-ink">Arwright</span>
        </Link>
      </header>

      <main className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="inline-block px-3 py-1 bg-ink/5 text-ink/40 text-[10px] font-medium tracking-[0.2em] uppercase rounded-full">
            Draft: pending final legal text
          </span>

          <h1 className="font-serif text-4xl md:text-6xl text-ink">{title}</h1>

          <div className="p-8 bg-stone-50 rounded-3xl border border-ink/10 space-y-4 text-ink/60 leading-relaxed">
            <p>
              This page is a draft placeholder. Our final {title} is being prepared and will be
              published here once it has been reviewed.
            </p>
            <p>
              If you have questions in the meantime, please email{' '}
              <a
                href="mailto:hello@arwrightlearning.com"
                className="text-ink underline underline-offset-4 hover:text-accent transition-colors"
              >
                hello@arwrightlearning.com
              </a>
              .
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/40 hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Arwright
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
