import { highlights, specs } from '../data/product';
import { Reveal } from './Reveal';

export function Details() {
  return (
    <section id="details" className="details" aria-labelledby="details-title">
      <div className="container">
        <Reveal className="section-head section-head--dark">
          <div>
            <p className="eyebrow eyebrow--orange">Design details</p>
            <h2 id="details-title" className="section-head__title">
              Built around the case.
            </h2>
          </div>
          <p className="section-head__note">
            Black outside, orange inside. These are the details visible in the supplied product photographs — nothing more.
          </p>
        </Reveal>

        <div className="details__grid">
          <Reveal className="details__panel">
            <span className="details__panel-label">Marking inside the case lid</span>
            <p className="details__figure">
              400<span>mAh</span>
            </p>
            <p className="details__caption">Case Battery: 400mAh · printed beside the CE and RoHS marks.</p>
            <div className="details__panel-rule" aria-hidden="true" />
            <p className="details__panel-foot">ZFORCE ZF-435</p>
          </Reveal>

          <ul className="details__list">
            {highlights.map((item, index) => (
              <Reveal as="li" className="details__item" delay={index * 60} key={item.title}>
                <span className="details__index" aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="specs">
          <div className="specs__head">
            <h3>Specifications</h3>
            <p>
              Only details confirmed by the supplied product references are listed. Anything unconfirmed is marked
              “Not specified” rather than guessed.
            </p>
          </div>
          <dl className="specs__list">
            {specs.map((row) => (
              <div className="specs__row" key={row.label}>
                <dt>{row.label}</dt>
                <dd className={row.value === 'Not specified' ? 'is-empty' : undefined}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
