import { useMeasure } from "react-use";

import { api, type RouterOutputs } from "~/utils/api";
import MyCldImage from "~/components/image/MyCldImage";
import { calcImgHeightForWidth } from "~/helpers/dimensions";
import { type StaticData } from "./staticData";

type RouterAlbum = RouterOutputs["album"]["albumPageGetOne"];
type Album = NonNullable<RouterAlbum>;

const AlbumPage = ({ albumId }: StaticData) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[1800px] p-8">
        <div>Album Page</div>
        <div>
          <Images albumId={albumId} />
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;

const Images = ({ albumId }: { albumId: string }) => {
  const { data } = api.album.albumPageGetOne.useQuery({ albumId });
  const album = data as Album;

  return (
    <div className="grid grid-cols-2 gap-md">
      {album.images.map((albumImage) => (
        <AlbumImage albumImage={albumImage} key={albumImage.id} />
      ))}
    </div>
  );
};

// ! next todo: open image. transform from initial position. Maybe use react-spring? Would need to load higher res image for new size.

const AlbumImage = ({ albumImage }: { albumImage: Album["images"][0] }) => {
  const [containerRef, { width: containerWidth }] =
    useMeasure<HTMLDivElement>();

  return (
    <div className="cursor-pointer" ref={containerRef}>
      {containerWidth ? (
        <MyCldImage
          dimensions={{
            height: calcImgHeightForWidth({
              containerWidth,
              image: {
                naturalHeight: albumImage.image.naturalHeight,
                naturalWidth: albumImage.image.naturalWidth,
              },
            }),
            width: containerWidth,
          }}
          src={albumImage.image.cloudinary_public_id}
        />
      ) : null}
    </div>
  );
};
