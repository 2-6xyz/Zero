import { useEffect, useRef, useState } from 'react';
import { useCart } from '../cart/CartProvider';
import { storeConfig } from '../config/store';
import { price } from '../data/product';
import { formatPrice } from '../lib/currency';
import { CheckIcon } from './Icons';
import { QuantityStepper } from './QuantityStepper';

interface BuyBoxProps {
  onOpenCart: () => void;
}

export function BuyBox({ onOpenCart }: BuyBoxProps) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const handleAdd = () => {
    add(quantity);
    setAdded(true);
    onOpenCart();
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="buybox">
      <h2 id="product-title" className="buybox__title">
        ZFORCE ZF-435 True Wireless Stereo Earbuds
      </h2>

      <div className="buybox__price">
        <span className="buybox__price-now">{formatPrice(price.sale)}</span>
        <s className="buybox__price-was">{formatPrice(price.compareAt)}</s>
        <span className="buybox__save">Save {formatPrice(price.savings)}</span>
      </div>

      <p className="buybox__desc">
        Matte-black wireless earbuds with chrome-finish accents and a vivid orange charging-case interior.
      </p>

      <div className="buybox__actions">
        <QuantityStepper
          value={quantity}
          onChange={(next) => setQuantity(Math.min(storeConfig.maxQuantity, Math.max(1, next)))}
          max={storeConfig.maxQuantity}
          label="Quantity"
        />
        <button type="button" className={`button button--primary buybox__add ${added ? 'is-added' : ''}`} onClick={handleAdd}>
          {added ? (
            <>
              <CheckIcon size={18} />
              Added
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>

      <p className="buybox__note">Order request only — no payment is collected on this site.</p>
    </div>
  );
}
