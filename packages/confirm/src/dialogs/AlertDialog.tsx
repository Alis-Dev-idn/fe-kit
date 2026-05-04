import React from "react";
import { DialogInstance, AlertOptions } from "../types";
import { DialogWrapper } from "../components/DialogWrapper";

export const AlertDialog: React.FC<{ instance: DialogInstance }> = ({ instance }) => {
  const options = instance.options as AlertOptions;

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
                className="confirm-btn confirm-btn-confirm" 
                onClick={() => close(undefined)}
              >
                {options.confirmLabel || "OK"}
              </button>
            </div>
          )}
        </>
      )}
    </DialogWrapper>
  );
};
