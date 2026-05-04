import { ModalConfig } from "../types";
import { modalStore } from "../core/ModalStore";

export const modal = {
  open: (config: ModalConfig): string => {
    const id = config.id || Math.random().toString(36).substring(2, 9);
    
    modalStore.addModal({
      ...config,
      id,
      isOpen: true,
    });
    
    return id;
  },

  close: (id: string) => {
    modalStore.closeModal(id);
  },

  closeTop: () => {
    modalStore.closeTop();
  },

  closeAll: () => {
    modalStore.closeAll();
  }
};
