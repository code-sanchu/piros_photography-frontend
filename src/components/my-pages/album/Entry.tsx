import { api } from "~/utils/api";
import { type Album } from "./_types";
import AlbumImage from "./image/Entry";
import { type StaticData } from "./staticData";

const AlbumPage = ({ albumId }: StaticData) => {
  const { data } = api.album.albumPageGetOne.useQuery({ albumId });
  const album = data as Album;

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-[1800px] p-8">
        <div>Album Page</div>
        {JSON.stringify(album.images.map((a) => a.index))}
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

// ! make sure deploy to vercel working then disconnect.
// ! next todo: open image. transform from initial position. Maybe use react-spring? Would need to load higher res image for new size.
