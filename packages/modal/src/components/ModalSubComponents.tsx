import React from "react";

export const ModalHeader: React.FC<{ children: React.ReactNode; showCloseButton?: boolean }> = ({ 
  children, 
  showCloseButton = true 
}) => {
  return (
    <div className="modal-header">
      {children}
      {showCloseButton && (
        <div className="modal-close-windows" style={{ marginLeft: 'auto', cursor: 'pointer' }}>
          ×
        </div>
      )}
    </div>
  );
};

export const ModalBody: React.FC<{ children: React.ReactNode; padding?: string | number }> = ({ 
  children, 
  padding = "1.5rem" 
}) => {
  return (
    <div className="modal-body" style={{ padding }}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<{ children: React.ReactNode; align?: "left" | "center" | "right"; divider?: boolean }> = ({ 
  children, 
  align = "right", 
  divider = true 
}) => {
  const justifyContent = align === "left" ? "flex-start" : align === "center" ? "center" : "flex-end";
  return (
    <div 
      className="modal-footer" 
      style={{ justifyContent, borderTop: divider ? undefined : 'none' }}
    >
      {children}
    </div>
  );
};
