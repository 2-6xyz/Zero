import { price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { scrollToSection } from '../hooks/useMotion';

export function Footer({ onOpenCart }: { onOpenCart: () => void }) {
  const go = (id: string) => scrollToSection(id);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a
              className="wordmark wordmark--footer"
              href="#home"
              onClick={(event) => {
                event.preventDefault();
                go('home');
              }}
            >
              ZFORCE
            </a>
            <p className="footer__line">
              ZF-435 true wireless stereo earbuds. One product, clearly priced in {formatPrice(price.sale)} — save{' '}
              {formatPrice(price.savings)}.
            </p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            <div>
              <h2>Shop</h2>
              <a
                href="#product"
                onClick={(event) => {
                  event.preventDefault();
                  go('product');
                }}
              >
                Product
              </a>
              <a
                href="#details"
                onClick={(event) => {
                  event.preventDefault();
                  go('details');
                }}
              >
                Details
              </a>
            </div>
            <div>
              <h2>Support</h2>
              <a
                href="#faq"
                onClick={(event) => {
                  event.preventDefault();
                  go('faq');
                }}
              >
                FAQ
              </a>
              <button type="button" onClick={onOpenCart}>
                Your bag
              </button>
            </div>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} ZFORCE</p>
          <p>Prices in AED. No payment is collected on this site.</p>
          <p className="footer__model">ZF-435</p>
        </div>
      </div>
    </footer>
  );
}
