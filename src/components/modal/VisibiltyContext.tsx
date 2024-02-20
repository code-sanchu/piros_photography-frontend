import { createContext, type ReactElement, useContext, useState } from "react";

type VisibilityState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const MyContext = createContext<VisibilityState | null>(null);

export const ModalVisibilityProvider = ({
  children,
}: {
  children: ReactElement | ((args: VisibilityState) => ReactElement);
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const value: VisibilityState = {
    isOpen,
    close() {
      setIsOpen(false);
    },
    open() {
      setIsOpen(true);
    },
  };

  return (
    <MyContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </MyContext.Provider>
  );
};

export const useModalVisibilityContext = () => {
  const value = useContext(MyContext);
  if (!value) {
    throw new Error("Missing Modal Visibility Provider");
  }
  return value;
};
