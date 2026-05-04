import { Modal as ModalBase } from "./components/Modal";
import { ModalHeader, ModalBody, ModalFooter } from "./components/ModalSubComponents";
import { ModalStack } from "./components/ModalStack";
import { useModal } from "./hooks/useModal";
import { ModalKit } from "./core/ModalKit";
import { modal } from "./imperative/modal";
import { ModalProps } from "./types";

export const Modal = ModalBase as any;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { useModal, ModalKit, ModalProps, ModalStack, modal };
export * from "./types";
