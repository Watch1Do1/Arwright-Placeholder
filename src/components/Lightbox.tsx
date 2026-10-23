import { useEffect, useRef, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

// A small, dependency-free modal image viewer: Esc or a click outside closes it, Tab stays
// inside the dialog, and the arrow keys move between images when there is more than one.
export default function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;
  const many = images.length > 1;

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const image = images[index];
  const go = (step: number) => onIndexChange((index + step + images.length) % images.length);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (many && e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (many && e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const captionId = 'lightbox-caption';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      aria-describedby={captionId}
      onKeyDown={handleKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
    >
      <figure className="relative max-w-6xl w-full max-h-full flex flex-col items-center gap-4">
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="max-h-[78vh] w-auto max-w-full rounded-2xl shadow-2xl bg-paper object-contain"
        />
        <figcaption id={captionId} className="text-paper/90 text-sm text-center max-w-2xl font-sans">
          {image.caption}
          {many && <span className="block text-paper/50 text-xs mt-1">{index + 1} of {images.length}</span>}
        </figcaption>
      </figure>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-paper/10 text-paper hover:bg-paper/20 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-paper"
      >
        <X className="w-5 h-5" />
      </button>
      {many && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-paper/10 text-paper hover:bg-paper/20 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-paper/10 text-paper hover:bg-paper/20 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
