import { type ReactElement } from "react";

import { ModalPanelWrapper } from "./PanelWrapper";
import { ModalVisibilityProvider } from "./VisibiltyContext";

export const Modal = ({
  button,
  panelContent,
  styles,
}: {
  button: (arg0: { openModal: () => void }) => ReactElement;
  panelContent:
    | ReactElement
    | ((arg0: { closeModal: () => void }) => ReactElement);
  styles?: { parentPanel?: string; bg?: string };
}) => {
  return (
    <ModalVisibilityProvider>
      {({ open: openModal, close: closeModal, isOpen }) => (
        <>
          {button({ openModal })}
          <ModalPanelWrapper
            isOpen={isOpen}
            closeModal={closeModal}
            styles={styles}
          >
            {typeof panelContent === "function"
              ? panelContent({ closeModal })
              : panelContent}
          </ModalPanelWrapper>
        </>
      )}
    </ModalVisibilityProvider>
  );
};
