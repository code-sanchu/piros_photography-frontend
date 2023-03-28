import { createContext, useContext, type ReactElement } from "react";

import { type AlbumImage } from "../_types";

type AlbumImageState = AlbumImage;

const Context = createContext<AlbumImageState | null>(null);

function Provider({
  children,
  albumImage,
}: {
  children: ReactElement | ((args: AlbumImageState) => ReactElement);
  albumImage: AlbumImage;
}) {
  const value: AlbumImageState = { ...albumImage };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useAlbumImageState must be used within its provider!");
  }

  return context;
};

export {
  Provider as AlbumImageProvider,
  useThisContext as useAlbumImageContext,
};
