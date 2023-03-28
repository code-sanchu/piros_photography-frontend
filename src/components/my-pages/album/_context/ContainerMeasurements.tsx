import { createContext, useContext, type ReactElement } from "react";

type State = {
  width: number;
  pos: {
    x: number;
    y: number;
  };
};

const Context = createContext<State | null>(null);

function Provider({
  children,
  ...value
}: {
  children: ReactElement | ((args: State) => ReactElement);
} & State) {
  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useAlbumState must be used within its provider!");
  }

  return context;
};

export {
  Provider as ContainerMeasurementsProvider,
  useThisContext as useContainerMeasurementsContext,
};
