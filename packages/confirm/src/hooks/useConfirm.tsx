import { useCallback, useMemo, useState } from "react";
import { ConfirmOptions, AlertOptions, PromptOptions } from "../types";
import { confirm as imperativeConfirm } from "../imperative/confirm";
import { alert as imperativeAlert } from "../imperative/alert";
import { prompt as imperativePrompt } from "../imperative/prompt";
import { ConfirmContainer } from "../components/ConfirmContainer";

export interface UseConfirmResult {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  alert: (options: AlertOptions) => Promise<void>;
  prompt: (options: PromptOptions) => Promise<string | null>;
  ConfirmDialog: React.FC;
}

/**
 * Hook for using confirmation dialogs within a component.
 */
export function useConfirm(): UseConfirmResult {
  const [isUsed, setIsUsed] = useState(false);

  const confirm = useCallback((options: ConfirmOptions) => {
    setIsUsed(true);
    return imperativeConfirm(options);
  }, []);

  const alert = useCallback((options: AlertOptions) => {
    setIsUsed(true);
    return imperativeAlert(options);
  }, []);

  const prompt = useCallback((options: PromptOptions) => {
    setIsUsed(true);
    return imperativePrompt(options);
  }, []);

  const ConfirmDialog = useMemo(() => {
    return () => {
      // Logic to check if rendered can be added here if needed
      return <ConfirmContainer />;
    };
  }, []);

  return {
    confirm,
    alert,
    prompt,
    ConfirmDialog,
  };
}
