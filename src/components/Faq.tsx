import { useId, useState } from 'react';
import { faqs } from '../data/product';
import { ChevronDownIcon } from './Icons';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <h2 id="faq-title" className="faq__title">
          FAQ
        </h2>

        <div className="faq__list">
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
        </div>
      </div>
    </section>
  );
}
