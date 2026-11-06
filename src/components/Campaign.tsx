import { campaignImage } from '../data/product';
import { ProductImage } from './ProductImage';

export function Campaign() {
  return (
    <section className="campaign" aria-labelledby="campaign-title">
      <div className="campaign__grid">
        <div className="campaign__copy">
          <span className="signature-rule" aria-hidden="true" />
          <h2 id="campaign-title" className="campaign__figure">
            400<span className="campaign__unit">mAh</span>
          </h2>
          <p className="campaign__caption">Case battery, marked inside the lid.</p>
        </div>

        <figure className="campaign__frame">
          <ProductImage
            src={campaignImage.src}
            alt={campaignImage.alt}
            className="campaign__image"
            loading="lazy"
            sizes="(min-width: 900px) 60vw, 100vw"
          />
        </figure>
      </div>
    </section>
  );
}
