import React, { useEffect, useState } from "react";
import { modalStore } from "../core/ModalStore";
import { ModalInstance } from "../types";
import { Modal } from "./Modal";

export const ModalStack: React.FC = () => {
  const [modals, setModals] = useState<ModalInstance[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = modalStore.subscribe((newModals) => {
      setModals(newModals);
    });
    return unsubscribe;
  }, []);

  if (!mounted) return null;

  return (
    <>
      {modals.map((m) => (
        <Modal
          key={m.id}
          {...m}
          isOpen={m.isOpen}
          onClose={() => {
            modalStore.closeModal(m.id);
            if (m.onClose) m.onClose();
            
            // Clean up from store after animation
            setTimeout(() => {
              modalStore.removeModal(m.id);
            }, 1000); // Buffer for animation
          }}
        >
          {m.content}
        </Modal>
      ))}
    </>
  );
};
