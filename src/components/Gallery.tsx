import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { galleryImages } from '../data/product';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';
import { ProductImage } from './ProductImage';

const SWIPE_THRESHOLD = 46;

export function Gallery() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touch = useRef<{ startX: number; startY: number; axis: 'none' | 'x' | 'y' } | null>(null);

  const goTo = (next: number) => {
    const total = galleryImages.length;
    setIndex(((next % total) + total) % total);
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const point = event.touches[0];
    if (!point) return;
    touch.current = { startX: point.clientX, startY: point.clientY, axis: 'none' };
    setDragging(true);
  };

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const point = event.touches[0];
    const start = touch.current;
    if (!point || !start) return;

    const dx = point.clientX - start.startX;
    const dy = point.clientY - start.startY;

    if (start.axis === 'none') {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) start.axis = 'x';
      else if (Math.abs(dy) > 8) start.axis = 'y';
    }

    if (start.axis === 'x') {
      const resistance = Math.abs(dx) > 140 ? 0.35 : 1;
      setDragX(dx * resistance);
    }
  };

  const endTouch = () => {
    const start = touch.current;
    const dx = dragX;
    touch.current = null;
    setDragging(false);
    setDragX(0);
    if (start?.axis === 'x' && Math.abs(dx) > SWIPE_THRESHOLD) {
      goTo(index + (dx < 0 ? 1 : -1));
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <div className="gallery">
      <div
        className="gallery__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="ZFORCE ZF-435 product photographs"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={endTouch}
        onTouchCancel={endTouch}
      >
        <div
          className={`gallery__track ${dragging ? 'is-dragging' : ''}`}
          style={{ transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)` }}
        >
          {galleryImages.map((image, slideIndex) => (
            <div
              key={image.src}
              className="gallery__slide"
              aria-hidden={slideIndex !== index}
              aria-label={`${slideIndex + 1} of ${galleryImages.length}: ${image.caption}`}
              role="group"
            >
              <ProductImage src={image.src} alt={image.alt} className="gallery__image" loading="lazy"                sizes="(max-width: 899px) 94vw, 50vw" />
            </div>
          ))}
        </div>

        <div className="gallery__nav">
          <button type="button" className="gallery__arrow" onClick={() => goTo(index - 1)} aria-label="Previous product image">
            <ArrowLeftIcon size={18} />
          </button>
          <button type="button" className="gallery__arrow" onClick={() => goTo(index + 1)} aria-label="Next product image">
            <ArrowRightIcon size={18} />
          </button>
        </div>

        <p className="gallery__status" aria-live="polite">
          Image {index + 1} of {galleryImages.length}: {galleryImages[index]?.caption}
        </p>
      </div>

      <div className="gallery__thumbs" role="group" aria-label="Choose a product image">
        {galleryImages.map((image, thumbIndex) => (
          <button
            key={image.src}
            type="button"
            className={`gallery__thumb ${thumbIndex === index ? 'is-active' : ''}`}
            onClick={() => setIndex(thumbIndex)}
            aria-label={`Show image ${thumbIndex + 1}: ${image.caption}`}
            aria-current={thumbIndex === index ? 'true' : undefined}
          >
            <ProductImage src={image.src} alt={image.caption} className="gallery__thumb-image" variant="compact" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
