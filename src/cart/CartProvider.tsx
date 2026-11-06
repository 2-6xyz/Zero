import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { price } from '../data/product';
import { storeConfig } from '../config/store';

const STORAGE_KEY = 'zforce.bag.v2';

interface Notice {
  id: number;
  message: string;
}

interface CartApi {
  quantity: number;
  count: number;
  subtotal: number;
  originalTotal: number;
  savings: number;
  notice: Notice | null;
  add: (quantity: number) => void;
  setQuantity: (quantity: number) => void;
  remove: () => void;
  clear: () => void;
}

const CartContext = createContext<CartApi | null>(null);

function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(storeConfig.maxQuantity, Math.max(0, Math.round(value)));
}

function readStoredQuantity(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return 0;
    const stored = (parsed as { quantity?: unknown }).quantity;
    return typeof stored === 'number' ? clampQuantity(stored) : 0;
  } catch {
    return 0;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantityState] = useState<number>(() => readStoredQuantity());
  const [notice, setNotice] = useState<Notice | null>(null);
  const quantityRef = useRef(quantity);

  useEffect(() => {
    quantityRef.current = quantity;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ quantity }));
    } catch {
      /* Storage can be unavailable in private modes; the bag still works in memory. */
    }
  }, [quantity]);

  const commit = useCallback((next: number, message: string) => {
    const value = clampQuantity(next);
    quantityRef.current = value;
    setQuantityState(value);
    setNotice({ id: Date.now(), message });
  }, []);

  const setQuantity = useCallback(
    (next: number) => {
      const value = clampQuantity(next);
      commit(
        value,
        value === 0
          ? 'ZF-435 removed from your bag.'
          : `Bag updated. ${value} unit${value === 1 ? '' : 's'} of the ZF-435.`,
      );
    },
    [commit],
  );

  const add = useCallback(
    (amount: number) => {
      const adding = Math.max(1, Math.round(amount));
      const value = clampQuantity(quantityRef.current + adding);
      commit(
        value,
        `Added ${adding} ZF-435${adding === 1 ? '' : 's'}. Your bag now has ${value} unit${value === 1 ? '' : 's'}.`,
      );
    },
    [commit],
  );

  const remove = useCallback(() => commit(0, 'ZF-435 removed from your bag.'), [commit]);

  const clear = useCallback(() => commit(0, 'Your bag is empty.'), [commit]);

  const value = useMemo<CartApi>(
    () => ({
      quantity,
      count: quantity,
      subtotal: quantity * price.sale,
      originalTotal: quantity * price.compareAt,
      savings: quantity * price.savings,
      notice,
      add,
      setQuantity,
      remove,
      clear,
    }),
    [quantity, notice, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>.');
  return context;
}
