import { useEffect, useState } from 'react';
import { useCart } from '../cart/CartProvider';
import { price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { scrollToSection } from '../hooks/useMotion';
import { BagIcon, CloseIcon, MenuIcon } from './Icons';

export const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'Product', id: 'product' },
  { label: 'Details', id: 'details' },
  { label: 'FAQ', id: 'faq' },
] as const;

interface HeaderProps {
  onOpenCart: () => void;
  onShopNow: () => void;
}

export function Header({ onOpenCart, onShopNow }: HeaderProps) {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 900) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header__inner">
        <a
          className="wordmark"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            go('home');
          }}
          aria-label="ZFORCE — back to top"
        >
          ZFORCE
          <span className="wordmark__dot" aria-hidden="true" />
        </a>

        <nav className="header__nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="header__link"
              onClick={(event) => {
                event.preventDefault();
                go(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <button type="button" className="bag-button" onClick={onOpenCart} aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}>
            <BagIcon size={21} />
            <span className="bag-button__count" key={count} aria-hidden="true">
              {count}
            </span>
          </button>
          <button
            type="button"
            className="icon-button menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        <nav className="container mobile-nav__inner" aria-label="Mobile">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="mobile-nav__link"
              style={{ transitionDelay: `${menuOpen ? 40 + index * 30 : 0}ms` }}
              onClick={(event) => {
                event.preventDefault();
                go(item.id);
              }}
            >
              <span>{item.label}</span>
              <span className="mobile-nav__index" aria-hidden="true">
                0{index + 1}
              </span>
            </a>
          ))}
          <div className="mobile-nav__footer">
            <div>
              <span className="mobile-nav__label">ZF-435</span>
              <span className="mobile-nav__price">
                {formatPrice(price.sale)} <s>{formatPrice(price.compareAt)}</s>
              </span>
            </div>
            <button
              type="button"
              className="button button--primary button--sm"
              onClick={() => {
                setMenuOpen(false);
                onShopNow();
              }}
            >
              Shop Now
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
