import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Locks page scroll, traps Tab focus inside `ref`, closes on Escape and
 * restores focus to the element that opened the overlay.
 */
export function useFocusTrap(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    if (!node) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const { overflow, paddingRight } = document.body.style;

    const focusable = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );

    // Focus the dialog container itself so its label is announced and no control
    // shows a focus ring purely because the overlay opened.
    const timer = window.setTimeout(() => {
      node.focus({ preventScroll: true });
    }, 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      window.clearTimeout(timer);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [open, ref, onClose]);
}
