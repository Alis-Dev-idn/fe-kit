import React, { useState, useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  Placement,
} from "@floating-ui/react";
import { useOverlay } from "../../hooks/useOverlay";

export interface OverlayProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
  title?: string;
  className?: string;
  responsive?: boolean; // If true, converts to bottom sheet on mobile
}

export const Popover: React.FC<OverlayProps> = ({
  trigger,
  children,
  placement = "bottom-start",
  title,
  className = "",
  responsive = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, setIsOpen, toggle } = useOverlay({ closeOnEsc: true });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const renderContent = () => {
    if (responsive && isMobile) {
      return (
        <FloatingPortal>
          {isOpen && (
            <>
              <div className="ui-overlay-backdrop" onClick={() => setIsOpen(false)} />
              <div className={`ui-bottom-sheet slide-up ${className}`}>
                {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
                <div className="pb-8">{children}</div>
              </div>
            </>
          )}
        </FloatingPortal>
      );
    }

    return (
      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={`ui-popover-content ${className}`}
            {...getFloatingProps()}
          >
            {title && <h3 className="text-sm font-semibold mb-2 border-bottom pb-2">{title}</h3>}
            {children}
          </div>
        )}
      </FloatingPortal>
    );
  };

  return (
    <>
      <div 
        ref={refs.setReference} 
        {...getReferenceProps()} 
        onClick={toggle}
        className="inline-block"
      >
        {trigger}
      </div>
      {renderContent()}
    </>
  );
};
