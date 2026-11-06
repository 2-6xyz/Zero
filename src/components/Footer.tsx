import { scrollToSection } from '../hooks/useMotion';

export function Footer({ onOpenCart }: { onOpenCart: () => void }) {
  const go = (id: string) => scrollToSection(id);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a
          className="wordmark"
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

        <p className="footer__meta">© {new Date().getFullYear()} ZFORCE · Prices in AED</p>
      </div>
    </footer>
  );
}
