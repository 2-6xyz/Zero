import { confirmedDetails } from '../data/product';

export function Details() {
  return (
    <div id="details" className="facts">
      <span className="signature-rule" aria-hidden="true" />
      <h2 id="product-title" className="facts__title">
        Product information
      </h2>
      <p className="facts__lede">ZFORCE ZF-435 · True wireless stereo earbuds</p>

      <dl className="facts__list">
        {confirmedDetails.map((row) => (
          <div className="facts__row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
