import { createContext, useContext, type ReactElement } from "react";

import { type AlbumImage } from "../_types";

type AlbumImageCommentState = AlbumImage["comments"][0];

const Context = createContext<AlbumImageCommentState | null>(null);

function Provider({
  children,
  comment,
}: {
  children: ReactElement | ((args: AlbumImageCommentState) => ReactElement);
  comment: AlbumImageCommentState;
}) {
  const value: AlbumImageCommentState = { ...comment };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      "useAlbumImageCommentState must be used within its provider!",
    );
  }

  return context;
};

export {
  Provider as AlbumImageCommentProvider,
  useThisContext as useAlbumImageComment,
};
