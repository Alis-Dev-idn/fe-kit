import React, { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  Placement,
} from "@floating-ui/react";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: Placement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <div 
        ref={refs.setReference} 
        {...getReferenceProps()} 
        className="inline-block"
      >
        {children}
      </div>
      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={`ui-tooltip-content ${className}`}
            {...getFloatingProps()}
          >
            {content}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};
