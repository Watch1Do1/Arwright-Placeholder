import { useState } from 'react';
import Lightbox, { LightboxImage } from './Lightbox';

const screens: (LightboxImage & { thumb: string })[] = [
  {
    src: '/screens/writing-process-review.webp',
    thumb: '/screens/writing-process-review-thumb.webp',
    width: 1600,
    height: 767,
    alt: "Arwright demo: a teacher's Writing Process Review of a sample essay, with an observations summary, drafting timeline, paste activity, revision depth and instructional guidance.",
    caption: 'A Writing Process Review gives the teacher evidence, not a verdict. The teacher makes the call.',
  },
  {
    src: '/screens/draft-replay.webp',
    thumb: '/screens/draft-replay-thumb.webp',
    width: 1600,
    height: 1000,
    alt: 'Arwright demo: the draft replay of a sample essay, with a timeline slider and the process facts the student saw before submitting.',
    caption: 'See how a paper developed, from early drafts to the final submission.',
  },
  {
    src: '/screens/writing-journey.webp',
    thumb: '/screens/writing-journey-thumb.webp',
    width: 1200,
    height: 997,
    alt: "Arwright demo: a sample student's Your Writing Journey page, with a chapter for one paper showing how it was built and the student's reflection.",
    caption: 'Students see their own Writing Journey, one chapter per paper, with their reflection.',
  },
];

export default function SeeItInAction() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="py-16 border-t border-accent/10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <h3 className="font-serif text-3xl text-ink">See it in action</h3>
        <p className="text-xs text-ink/40">Screens from the Arwright demo, with sample data. Click to enlarge.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {screens.map((screen, i) => (
          <figure key={screen.src} className="space-y-3">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Enlarge: ${screen.caption}`}
              className="block w-full aspect-[16/10] overflow-hidden rounded-2xl border border-ink/10 bg-stone-50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <img
                src={screen.thumb}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
            </button>
            <figcaption className="text-sm text-ink/60 leading-relaxed">{screen.caption}</figcaption>
          </figure>
        ))}
      </div>
      <Lightbox images={screens} index={open} onClose={() => setOpen(null)} onIndexChange={setOpen} />
    </div>
  );
}
