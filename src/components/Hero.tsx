import { useState } from 'react';
import { heroImages, price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { ProductImage } from './ProductImage';

interface HeroProps {
  onShopNow: () => void;
}

export function Hero({ onShopNow }: HeroProps) {
  const [index, setIndex] = useState(0);

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero__intro">
        <div className="hero__heading">
          <h1 id="hero-title" className="hero__title">
            ZF-435
            <span className="hero__sub">Wireless Earbuds</span>
          </h1>
        </div>

        <div className="hero__buy">
          <p className="hero__lede">Matte black outside. Vivid orange inside.</p>

          <div className="hero__price">
            <span className="hero__price-now">{formatPrice(price.sale)}</span>
            <s className="hero__price-was">{formatPrice(price.compareAt)}</s>
            <span className="hero__price-save">Save {formatPrice(price.savings)}</span>
          </div>

          <button type="button" className="button button--primary button--lg" onClick={onShopNow}>
            Shop now
          </button>
        </div>
      </div>

      <div className={`hero__media ${index === 1 ? 'is-lifestyle' : ''}`}>
        <div className="hero__frame">
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
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        <div className="hero__dots" role="group" aria-label="Hero image">
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
    </section>
  );
}
