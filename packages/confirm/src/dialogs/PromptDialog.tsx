import React, { useState } from "react";
import { DialogInstance, PromptOptions } from "../types";
import { DialogWrapper } from "../components/DialogWrapper";

export const PromptDialog: React.FC<{ instance: DialogInstance }> = ({ instance }) => {
  const options = instance.options as PromptOptions;
  const [value, setValue] = useState(options.defaultValue || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (close: (val: any) => void) => {
    if (options.validation) {
      const result = options.validation.safeParse(value);
      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }
    }
    close(value);
  };

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
                <input
                  className="confirm-prompt-input"
                  type="text"
                  placeholder={options.placeholder}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setError(null);
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(close);
                  }}
                />
                {error && <div className="confirm-error">{error}</div>}
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
                onClick={() => close(null)}
              >
                {options.cancelLabel || "Cancel"}
              </button>
              <button 
                className="confirm-btn confirm-btn-confirm" 
                onClick={() => handleSubmit(close)}
              >
                {options.confirmLabel || "Submit"}
              </button>
            </div>
          )}
        </>
      )}
    </DialogWrapper>
  );
};
