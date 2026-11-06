import { useCallback, useState } from 'react';
import { CartProvider, useCart } from './cart/CartProvider';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutDialog } from './components/CheckoutDialog';
import { Details } from './components/Details';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { scrollToSection } from './hooks/useMotion';

function CartAnnouncer() {
  const { notice } = useCart();
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {notice ? <span key={notice.id}>{notice.message}</span> : null}
    </div>
  );
}

function Storefront() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

  const startCheckout = useCallback(() => {
    setCartOpen(false);
    setCheckoutOpen(true);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header onOpenCart={openCart} onShopNow={() => scrollToSection('product')} />

      <main id="main">
        <Hero onShopNow={() => scrollToSection('product')} />
        <ProductSection onOpenCart={openCart} />
        <Details />
        <Faq />
      </main>

      <Footer onOpenCart={openCart} />

      <CartDrawer open={cartOpen} onClose={closeCart} onCheckout={startCheckout} />
      <CheckoutDialog open={checkoutOpen} onClose={closeCheckout} />
      <CartAnnouncer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}
