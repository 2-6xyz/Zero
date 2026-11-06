import { useId, useState } from 'react';
import { faqs } from '../data/product';
import { ChevronDownIcon } from './Icons';
import { Reveal } from './Reveal';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <Reveal className="faq__intro">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-title" className="section-head__title">
            Good to know
          </h2>
          <p className="faq__lede">
            Practical answers about ordering the ZF-435. Where a detail is not confirmed, it is left out rather than
            invented.
          </p>
          <div className="faq__aside">
            <p className="faq__aside-label">Order references</p>
            <p>Every submitted order request receives a ZF reference number. Keep it for any follow-up about payment or delivery.</p>
          </div>
        </Reveal>

        <Reveal className="faq__list" delay={80}>
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${baseId}-question-${index}`;
            const panelId = `${baseId}-answer-${index}`;
            return (
              <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={item.question}>
                <h3 className="faq__question">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq__icon" aria-hidden="true">
                      <ChevronDownIcon size={18} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq__panel"
                  aria-hidden={!isOpen}
                >
                  <div className="faq__panel-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
