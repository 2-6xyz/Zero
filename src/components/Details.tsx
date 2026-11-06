import { confirmedDetails } from '../data/product';

export function Details() {
  return (
    <section id="details" className="details" aria-labelledby="details-title">
      <div className="container details__grid">
        <div className="details__intro">
          <h2 id="details-title" className="details__title">
            Details
          </h2>
          <p className="details__note">Only details confirmed by the product photography.</p>
        </div>

        <dl className="details__list">
          {confirmedDetails.map((row) => (
            <div className="details__row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
