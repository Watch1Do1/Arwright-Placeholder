import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Footer from './Footer';

interface LegalPageProps {
  markdown: string;
}

const components: Components = {
  a({ href, children }) {
    const className = 'text-ink underline underline-offset-4 hover:text-accent transition-colors';
    if (href?.startsWith('/')) {
      return (
        <Link to={href} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto my-6 border border-ink/10 rounded-2xl">
        <table className="w-full min-w-[32rem] text-sm text-left border-collapse">{children}</table>
      </div>
    );
  },
};

export default function LegalPage({ markdown }: LegalPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const previous = document.title;
    if (heading) document.title = heading;
    return () => {
      document.title = previous;
    };
  }, [markdown]);

  return (
    <>
      <header className="px-6 py-4 border-b border-ink/5">
        <Link to="/" className="inline-flex items-center gap-3">
          <img src="/logo.PNG" alt="Arwright Logo" className="w-8 h-8 object-contain" />
          <span className="font-serif text-2xl font-semibold tracking-tight text-ink">Arwright</span>
        </Link>
      </header>

      <main className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <article className="legal-doc">
            <Markdown remarkPlugins={[remarkGfm]} components={components}>
              {markdown}
            </Markdown>
          </article>

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
