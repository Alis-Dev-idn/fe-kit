import { Modal as ModalBase, ModalProps } from "./components/Modal";
import { ModalHeader, ModalBody, ModalFooter } from "./components/ModalSubComponents";
import { useModal } from "./hooks/useModal";
import { ModalKit } from "./core/ModalKit";

export const Modal = ModalBase as any;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { useModal, ModalKit, ModalProps };
export * from "./types";
