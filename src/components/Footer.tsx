import { scrollToSection } from '../hooks/useMotion';

export function Footer({ onOpenCart }: { onOpenCart: () => void }) {
  const go = (id: string) => scrollToSection(id);

  return (
    <footer className="footer">
      <div className="container footer__inner">
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

        <nav className="footer__nav" aria-label="Footer">
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
            Bag
          </button>
        </nav>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} ZFORCE</p>
          <p>Prices in AED. Order requests only — no payment is collected here.</p>
        </div>
      </div>
    </footer>
  );
}
