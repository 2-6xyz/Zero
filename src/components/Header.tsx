import { useEffect, useState } from 'react';
import { useCart } from '../cart/CartProvider';
import { scrollToSection } from '../hooks/useMotion';
import { BagIcon, CloseIcon, MenuIcon } from './Icons';

export const NAV_ITEMS = [
  { label: 'Product', id: 'product' },
  { label: 'Details', id: 'details' },
  { label: 'FAQ', id: 'faq' },
] as const;

interface HeaderProps {
  onOpenCart: () => void;
}

export function Header({ onOpenCart }: HeaderProps) {
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
      if (window.innerWidth >= 760) setMenuOpen(false);
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
          <button
            type="button"
            className="bag-button"
            onClick={onOpenCart}
            aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
          >
            <BagIcon size={18} />
            <span className="bag-button__label">Bag</span>
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
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
