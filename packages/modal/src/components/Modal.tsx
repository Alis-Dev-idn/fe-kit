import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ModalSize, ModalPosition, AnimationConfig, CloseButtonStyle, ScrollBehavior } from "../types";
import { ModalKit } from "../core/ModalKit";
import { modalStack } from "../core/ModalStack";
import "./modal.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  size?: ModalSize;
  position?: ModalPosition;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  preventClose?: boolean;
  closeButtonStyle?: CloseButtonStyle;
  closeButton?: React.ReactNode;
  scrollBehavior?: ScrollBehavior;
  animation?: AnimationConfig;
  children: React.ReactNode;
}

const SIZE_PRESETS: Record<string, string> = {
  xs: "320px",
  sm: "480px",
  md: "600px",
  lg: "800px",
  xl: "1024px",
  full: "100vw",
};

export const Modal: React.FC<ModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    children,
    size = "md",
    position = "center",
    closeOnBackdrop = true,
    closeOnEscape = true,
    preventClose = false,
  } = props;

  const [id] = useState(() => Math.random().toString(36).substring(2, 9));
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const config = ModalKit.getConfig();
  const duration = props.animation?.duration || config.animation.duration;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      modalStack.push(id);
      setIsAnimating(true);
      if (props.onOpen) props.onOpen();
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        modalStack.pop(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, id, duration, props.onOpen]);

  const handleClose = useCallback(() => {
    if (!preventClose) onClose();
  }, [preventClose, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && closeOnEscape && modalStack.isTop(id)) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, id, handleClose]);

  if (!mounted || (!isOpen && !isAnimating)) return null;

  const zIndex = modalStack.getZIndex(id);
  const backdropConfig = config.backdrop;
  const opacity = (backdropConfig.baseOpacity ?? 0.5) + (modalStack.getCount() - 1) * (backdropConfig.opacityIncrement ?? 0.1);

  const width = typeof size === "string" ? SIZE_PRESETS[size] : size.width;
  const height = typeof size === "object" ? size.height : undefined;

  return createPortal(
    <div 
      className={`modal-overlay modal-overlay-${position} ${isOpen ? "modal-fade-in-active" : "modal-fade-in"}`}
      style={{ zIndex, transitionDuration: `${duration}ms` }}
    >
      {backdropConfig.enabled && (
        <div 
          className="modal-backdrop" 
          style={{ opacity: isOpen ? opacity : 0 }} 
          onClick={() => closeOnBackdrop && handleClose()}
        />
      )}
      <div 
        className={`modal-content modal-content-${position} ${isOpen ? "modal-zoom-in-active" : "modal-zoom-in"}`}
        style={{ width, height, transitionDuration: `${duration}ms` }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
