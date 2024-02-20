import { type RouterOutputs } from "~/utils/api";

type RouterAlbum = RouterOutputs["album"]["albumPageGetOne"];

export type Album = NonNullable<RouterAlbum>;
export type AlbumImage = Album["images"][0];
