import { type ReactElement } from "react";

import { ModalPanelWrapper } from "./PanelWrapper";
import { ModalVisibilityProvider } from "./VisibiltyContext";

export const Modal = ({
  button,
  panelContent,
  styles,
}: {
  button: (arg0: { openModal: () => void }) => ReactElement;
  panelContent: ReactElement;
  // panelContent: (arg0: { close: () => void }) => ReactElement;
  styles?: { parentPanel?: string };
}) => {
  return (
    <ModalVisibilityProvider>
      {({ open: openModal, close, isOpen }) => (
        <>
          {button({ openModal })}
          <ModalPanelWrapper isOpen={isOpen} closeModal={close} styles={styles}>
            {panelContent}
          </ModalPanelWrapper>
        </>
      )}
    </ModalVisibilityProvider>
  );
};
