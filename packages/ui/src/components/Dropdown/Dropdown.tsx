import React, { useState } from "react";
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

export interface DropdownItem {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  children?: DropdownItem[]; // 1 level nesting support
  className?: string;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: Placement;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = "bottom-start",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
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

  return (
    <>
      <div 
        ref={refs.setReference} 
        {...getReferenceProps()} 
        className="inline-block"
      >
        {trigger}
      </div>
      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={`ui-popover-content min-w-[160px] p-1 ${className}`}
            {...getFloatingProps()}
          >
            {items.map((item, idx) => (
              <DropdownMenuItem 
                key={idx} 
                item={item} 
                onClose={() => setIsOpen(false)} 
              />
            ))}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

const DropdownMenuItem: React.FC<{ item: DropdownItem; onClose: () => void }> = ({ item, onClose }) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  
  const { refs, floatingStyles, context } = useFloating({
    open: isSubOpen,
    onOpenChange: setIsSubOpen,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: "right-start",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  const handleClick = () => {
    if (item.disabled) return;
    if (item.children) {
      setIsSubOpen(!isSubOpen);
    } else {
      item.onClick?.();
      onClose();
    }
  };

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={handleClick}
        disabled={item.disabled}
        className={`
          w-full text-left px-3 py-2 text-sm rounded-[var(--ui-radius-sm)]
          flex items-center justify-between
          hover:bg-[var(--ui-secondary)] disabled:opacity-50 disabled:pointer-events-none
          ${item.className || ""}
        `}
      >
        <span className="flex items-center gap-2">
          {item.icon}
          {item.label}
        </span>
        {item.children && (
          <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {item.children && isSubOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="ui-popover-content min-w-[160px] p-1 z-[1100]"
            {...getFloatingProps()}
          >
            {item.children.map((child, idx) => (
              <DropdownMenuItem 
                key={idx} 
                item={child} 
                onClose={() => {
                  setIsSubOpen(false);
                  onClose();
                }} 
              />
            ))}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};
