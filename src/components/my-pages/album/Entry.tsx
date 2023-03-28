import { api } from "~/utils/api";
import Header from "~/components/header/Entry";
import { AlbumImageProvider, AlbumProvider, useAlbumContext } from "./_context";
import { type Album } from "./_types";
import AlbumImage from "./image/Entry";
import { type StaticData } from "./staticData";

const AlbumPage = ({ albumId }: StaticData) => {
  const { data } = api.album.albumPageGetOne.useQuery({ albumId });
  const album = data as Album;

  return (
    <div>
      <Header />
      <AlbumProvider album={album}>
        <div className="flex min-h-screen justify-center">
          <div className="w-full max-w-[1800px] p-8">
            <div>Album Page</div>
            <div>
              <Images />
            </div>
          </div>
        </div>
      </AlbumProvider>
    </div>
  );
};

export default AlbumPage;

const Images = () => {
  const album = useAlbumContext();

  return (
    <div className="grid grid-cols-2 gap-md">
      {album.images.map((albumImage) => (
        <AlbumImageProvider albumImage={albumImage} key={albumImage.id}>
          <AlbumImage />
        </AlbumImageProvider>
      ))}
    </div>
  );
};
