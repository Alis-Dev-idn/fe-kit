import React from "react";
import { DialogInstance, ConfirmOptions } from "../types";
import { DialogWrapper } from "../components/DialogWrapper";

export const ConfirmDialog: React.FC<{ instance: DialogInstance }> = ({ instance }) => {
  const options = instance.options as ConfirmOptions;

  return (
    <DialogWrapper instance={instance}>
      {({ close, countdown }) => (
        <>
          <div className="confirm-content">
            {options.component ? (
              options.component
            ) : (
              <>
                <h3 className="confirm-title">{options.title}</h3>
                {options.message && <p className="confirm-message">{options.message}</p>}
              </>
            )}
            {countdown !== undefined && (
              <div className="confirm-countdown">Auto-closing in {countdown}s</div>
            )}
          </div>
          {!options.component && (
            <div className="confirm-actions-inner">
              <button 
                className="confirm-btn confirm-btn-cancel" 
                onClick={() => close(false)}
              >
                {options.cancelLabel || "Cancel"}
              </button>
              <button 
                className="confirm-btn confirm-btn-confirm" 
                onClick={() => close(true)}
              >
                {options.confirmLabel || "Confirm"}
              </button>
            </div>
          )}
        </>
      )}
    </DialogWrapper>
  );
};
