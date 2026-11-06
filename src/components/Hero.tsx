import { heroImage, price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { ProductImage } from './ProductImage';

interface HeroProps {
  onShopNow: () => void;
}

export function Hero({ onShopNow }: HeroProps) {
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

      <div className="hero__media">
        <div className="hero__frame">
          <ProductImage
            src={heroImage.src}
            alt={heroImage.alt}
            className="hero__image"
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
