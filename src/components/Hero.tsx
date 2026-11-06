import { useState } from 'react';
import { useCart } from '../cart/CartProvider';
import { storeConfig } from '../config/store';
import { heroImage, price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { ProductImage } from './ProductImage';
import { QuantityStepper } from './QuantityStepper';

interface HeroProps {
  onOpenCart: () => void;
}

export function Hero({ onOpenCart }: HeroProps) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__grid">
        <div className="hero__content">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__model">ZF-435</span>
            <span className="hero__type">Wireless earbuds</span>
          </h1>

          <p className="hero__lede">Matte black outside. Vivid orange inside.</p>

          <div className="hero__buy">
            <p className="hero__price">
              <span className="hero__price-now">{formatPrice(price.sale)}</span>
              <s className="hero__price-was">{formatPrice(price.compareAt)}</s>
              <span className="hero__price-save">Save {formatPrice(price.savings)}</span>
            </p>

            <div className="hero__actions">
              <QuantityStepper
                value={quantity}
                onChange={(next) => setQuantity(Math.min(storeConfig.maxQuantity, Math.max(1, next)))}
                max={storeConfig.maxQuantity}
                label="Quantity"
              />
              <button
                type="button"
                className="button button--primary button--lg hero__add"
                onClick={() => {
                  add(quantity);
                  onOpenCart();
                }}
              >
                Add to bag
              </button>
            </div>

            <p className="hero__note">Order request only. No payment is collected.</p>
          </div>
        </div>

        <div className="hero__media">
          <ProductImage
            src={heroImage.src}
            alt={heroImage.alt}
            className="hero__image"
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 980px) 57vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
