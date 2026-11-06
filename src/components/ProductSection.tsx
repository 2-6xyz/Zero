import { Details } from './Details';
import { Gallery } from './Gallery';

export function ProductSection() {
  return (
    <section id="product" className="product" aria-labelledby="product-title">
      <div className="container product__grid">
        <div className="product__gallery">
          <Gallery />
        </div>

        <aside className="product__info">
          <Details />
        </aside>
      </div>
    </section>
  );
}
