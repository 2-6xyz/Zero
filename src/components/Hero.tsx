import { useEffect, useState } from 'react';
import { heroImages, price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { usePrefersReducedMotion } from '../hooks/useMotion';
import { ArrowRightIcon } from './Icons';
import { ProductImage } from './ProductImage';

interface HeroProps {
  onShopNow: () => void;
}

export function Hero({ onShopNow }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroImages.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, paused]);

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--pill">
            <span className="eyebrow__dot" aria-hidden="true" />
            ZFORCE&nbsp;·&nbsp;ZF-435
          </p>

          <h1 id="hero-title" className="hero__title">
            ZFORCE ZF-435
            <span className="hero__title-line">Wireless Earbuds</span>
          </h1>

          <p className="hero__lede">
            True wireless stereo listening, finished in matte black and opening to a vivid orange case interior.
          </p>

          <div className="hero__price price-row">
            <span className="price-row__now">
              <span className="price-row__currency">AED</span>
              <span className="price-row__amount">{price.sale}</span>
            </span>
            <span className="price-row__meta">
              <s className="price-row__was">
                <span className="sr-only">Original price </span>
                {formatPrice(price.compareAt)}
              </s>
              <span className="chip chip--save">Save {formatPrice(price.savings)}</span>
            </span>
          </div>

          <div className="hero__actions">
            <button type="button" className="button button--primary button--lg" onClick={onShopNow}>
              Shop Now
              <ArrowRightIcon size={18} />
            </button>
          </div>

          <ul className="hero__facts" aria-label="Product highlights">
            <li>Matte black case</li>
            <li>Orange interior</li>
            <li>400mAh marking</li>
          </ul>
        </div>

        <div
          className="hero__media"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
          }}
        >
          <div className="hero__frame">
            <div className="hero__slides">
              {heroImages.map((image, slideIndex) => (
                <div
                  key={image.src}
                  className={`hero__slide ${slideIndex === index ? 'is-active' : ''}`}
                  aria-hidden={slideIndex !== index}
                >
                  <ProductImage
                    src={image.src}
                    alt={image.alt}
                    className="hero__image"
                    loading={slideIndex === 0 ? 'eager' : 'lazy'}
                    fetchPriority={slideIndex === 0 ? 'high' : 'low'}
                    sizes="(max-width: 899px) 100vw, 58vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hero__controls">
            <p className="hero__counter" aria-hidden="true">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span className="hero__counter-sep">/</span>
              <span>{String(heroImages.length).padStart(2, '0')}</span>
            </p>
            <div className="hero__dots" role="group" aria-label="Hero images">
              {heroImages.map((image, dotIndex) => (
                <button
                  key={image.src}
                  type="button"
                  className={`hero__dot ${dotIndex === index ? 'is-active' : ''}`}
                  onClick={() => setIndex(dotIndex)}
                  aria-label={dotIndex === 0 ? 'Show studio image' : 'Show lifestyle image'}
                  aria-current={dotIndex === index ? 'true' : undefined}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
