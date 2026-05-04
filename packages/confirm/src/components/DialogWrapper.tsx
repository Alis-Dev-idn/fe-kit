import React, { useEffect, useRef, useState, useCallback } from "react";
import { ConfirmKit } from "../core/ConfirmKit";
import { DialogInstance, AnimationType } from "../types";
import { confirmStore } from "../core/ConfirmStore";

interface DialogWrapperProps {
  instance: DialogInstance;
  children: (props: { 
    close: (value: any) => void; 
    countdown?: number;
  }) => React.ReactNode;
}

export const DialogWrapper: React.FC<DialogWrapperProps> = ({ instance, children }) => {
  const { options, resolve, id } = instance;
  const config = ConfirmKit.getConfig();
  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState<number | undefined>(
    options.timeout?.showCountdown ? Math.ceil(options.timeout.duration / 1000) : undefined
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const animationIn = options.animation?.in || config.animation.in;
  const animationOut = options.animation?.out || config.animation.out;
  const duration = options.animation?.duration || config.animation.duration;

  const backdrop = { ...config.backdrop, ...options.backdrop };

  const close = useCallback((value: any) => {
    setIsAnimating(false);
    setTimeout(() => {
      resolve(value);
      confirmStore.removeDialog(id);
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }, duration);
  }, [resolve, id, duration]);

  // Handle Backdrop Click
  const onBackdropClick = () => {
    if (backdrop.dismissible && !options.preventClose) {
      close(instance.type === "prompt" ? null : false);
    }
  };

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === config.keyboard.cancel && !options.preventClose) {
        close(instance.type === "prompt" ? null : false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config.keyboard.cancel, options.preventClose, close, instance.type]);

  // Focus Trap
  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    setIsAnimating(true);

    if (config.keyboard.trapFocus && wrapperRef.current) {
      const focusableElements = wrapperRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) firstElement.focus();
    }
  }, [config.keyboard.trapFocus]);

  // Timeout Logic
  useEffect(() => {
    if (options.timeout) {
      const timer = setTimeout(() => {
        close(options.timeout?.action === "confirm" ? true : (instance.type === "prompt" ? null : false));
      }, options.timeout.duration);

      let interval: NodeJS.Timeout;
      if (options.timeout.showCountdown) {
        interval = setInterval(() => {
          setCountdown((prev) => (prev && prev > 0 ? prev - 1 : 0));
        }, 1000);
      }

      return () => {
        clearTimeout(timer);
        if (interval) clearInterval(interval);
      };
    }
  }, [options.timeout, close, instance.type]);

  const getAnimationClass = () => {
    if (!isAnimating) return "";
    switch (animationIn) {
      case "fade": return "confirm-fade-in-active";
      case "zoom": return "confirm-zoom-in-active";
      case "slide": return "confirm-slide-in-active";
      case "bounce": return "confirm-bounce-in-active";
      default: return "confirm-fade-in-active";
    }
  };

  const getBaseAnimationClass = () => {
    switch (animationIn) {
      case "fade": return "confirm-fade-in";
      case "zoom": return "confirm-zoom-in";
      case "slide": return "confirm-slide-in";
      case "bounce": return "confirm-bounce-in";
      default: return "confirm-fade-in";
    }
  };

  return (
    <div 
      className={`confirm-overlay ${isAnimating ? "confirm-fade-in-active" : "confirm-fade-in"}`}
      data-confirm-theme={config.theme}
    >
      {backdrop.enabled && (
        <div 
          className={`confirm-backdrop ${backdrop.blur ? "confirm-backdrop-blur" : ""}`} 
          onClick={onBackdropClick}
        />
      )}
      <div 
        ref={wrapperRef}
        className={`confirm-dialog ${getBaseAnimationClass()} ${getAnimationClass()} ${window.innerWidth <= 768 && isAnimating ? "confirm-dialog-active" : ""}`}
        style={{ transitionDuration: `${duration}ms` }}
      >
        {window.innerWidth <= 768 && <div className="confirm-mobile-handle" />}
        {children({ close, countdown })}
      </div>
    </div>
  );
};
