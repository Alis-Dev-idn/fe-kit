import React from "react";
import { modal, Modal, useModal } from "@alisdev/fe-kit-modal";
import { KitBadge } from "../components/shared/KitBadge";
import { InstallBlock } from "../components/shared/InstallBlock";
import { DemoArea } from "../components/shared/DemoArea";
import { ApiTable } from "../components/shared/ApiTable";
import { TabbedCode } from "../components/shared/TabbedCode";
import { Callout } from "../components/shared/Callout";
import { Button } from "@alisdev/fe-kit-ui";

import { PropsTable, PropRow } from "../components/shared/PropsTable";

const MODAL_PROPS: PropRow[] = [
  { name: "isOpen", type: "boolean", required: true, description: "Whether the modal is visible." },
  { name: "onClose", type: "() => void", required: true, description: "Callback triggered when the modal should close." },
  { name: "size", type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: "The width of the modal." },
  { name: "position", type: "'center' | 'top' | 'bottom'", default: "'center'", description: "Vertical position of the modal." },
  { name: "closeOnBackdrop", type: "boolean", default: "true", description: "Whether clicking the backdrop closes the modal." },
  { name: "closeOnEscape", type: "boolean", default: "true", description: "Whether pressing Escape closes the modal." },
];

export const ModalPage: React.FC = () => {
  const { isOpen, open, close } = useModal();

  const openNested = (level: number) => {
    modal.open({
      content: (
        <>
          <Modal.Header>Modal Level {level}</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <p className="text-text-2">This is modal level {level} in the stack.</p>
              <div className="flex gap-2">
                {level < 3 && (
                  <Button 
                    onClick={() => openNested(level + 1)}
                  >
                    Open Level {level + 1}
                  </Button>
                )}
                <Button 
                  variant="ghost"
                  onClick={() => modal.closeAll()}
                >
                  Close All
                </Button>
              </div>
            </div>
          </Modal.Body>
        </>
      )
    });
  };

  return (
    <div className="pb-20">
      <section className="mb-16">
        <KitBadge category="UI & Overlay" />
        <h1 className="text-4xl font-bold mb-4">Modal Kit</h1>
        <p className="text-text-2 text-lg leading-relaxed mb-6 max-w-3xl">
          Advanced modal management with stacking support. 
          Handles z-index, backdrops, and focus trapping automatically.
        </p>
        <InstallBlock packageName="@alisdev/fe-kit-modal" />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Live Demo</h2>
        <DemoArea>
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <Button onClick={open}>
                Declarative Modal
              </Button>
              <Button variant="ghost" onClick={() => openNested(1)}>
                Stackable Modals (Imperative)
              </Button>
            </div>

            <Modal isOpen={isOpen} onClose={close}>
              <Modal.Header>Declarative Modal</Modal.Header>
              <Modal.Body>
                <p className="text-text-2">
                  This modal is controlled via <code>useModal</code> hook. 
                  Perfect for local component state.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={close} fullWidth>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </DemoArea>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Modal Props</h2>
        <PropsTable props={MODAL_PROPS} />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Subcomponents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <h4 className="font-bold mb-2">Modal.Header</h4>
            <p className="text-sm text-text-2">Title area with optional close button integration.</p>
          </div>
          <div className="card">
            <h4 className="font-bold mb-2">Modal.Body</h4>
            <p className="text-sm text-text-2">Main scrollable content area with standard padding.</p>
          </div>
          <div className="card">
            <h4 className="font-bold mb-2">Modal.Footer</h4>
            <p className="text-sm text-text-2">Bottom action area for buttons and controls.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Notes</h2>
        <Callout type="info" title="Z-Index Management">
          The kit automatically calculates z-index based on the order of opening. 
          Backdrops are intelligently layered to only show one active backdrop for the top modal.
        </Callout>
      </section>
    </div>
  );
};
