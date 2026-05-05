import { useState, useCallback, useEffect } from "react";

export interface UseOverlayOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
}

export function useOverlay(options: UseOverlayOptions = {}) {
  const [isOpen, setIsOpen] = useState(options.defaultOpen || false);

  const open = useCallback(() => {
    setIsOpen(true);
    options.onOpen?.();
  }, [options]);

  const close = useCallback(() => {
    setIsOpen(false);
    options.onClose?.();
  }, [options]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  useEffect(() => {
    if (!isOpen || !options.closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, options.closeOnEsc, close]);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
  };
}
