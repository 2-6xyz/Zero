import { BuyBox } from './BuyBox';
import { Gallery } from './Gallery';

export function ProductSection({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <section id="product" className="product" aria-labelledby="product-title">
      <div className="container product__grid">
        <div className="product__gallery">
          <Gallery />
        </div>
        <div className="product__buy">
          <BuyBox onOpenCart={onOpenCart} />
        </div>
      </div>
    </section>
  );
}
