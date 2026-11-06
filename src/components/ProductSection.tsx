import { BuyBox } from './BuyBox';
import { Gallery } from './Gallery';
import { Reveal } from './Reveal';

export function ProductSection({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <section id="product" className="product" aria-labelledby="product-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">The product</p>
            <h2 id="product-title" className="section-head__title">
              One case. Two earbuds.
            </h2>
          </div>
          <p className="section-head__note">
            Three supplied photographs of the ZF-435. Swipe on a phone or use the thumbnails to move between views.
          </p>
        </Reveal>

        <div className="product__grid">
          <Reveal className="product__gallery" delay={40}>
            <Gallery />
          </Reveal>
          <Reveal className="product__buy" delay={110}>
            <BuyBox onOpenCart={onOpenCart} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
