import { type RouterOutputs } from "~/utils/api";
import { type MyOmit } from "~/types/utilities";

type RouterAlbum = RouterOutputs["album"]["albumsPageGetAll"][0];
// albums query filters for cover image, but prisma doesn't give correct type. See issue [https://github.com/prisma/prisma/discussions/2772].
export type Album = MyOmit<RouterAlbum, "coverImage"> & {
  coverImage: NonNullable<RouterAlbum["coverImage"]>;
};
