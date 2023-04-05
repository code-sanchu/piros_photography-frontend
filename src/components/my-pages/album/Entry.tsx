import { type ReactElement } from "react";

import { api } from "~/utils/api";
import Header from "~/components/header2/Entry";
import { AlbumImageProvider, AlbumProvider, useAlbumContext } from "./_context";
import { type Album } from "./_types";
import ImagesSwiper from "./image-swiper/Entry";
import AlbumImage from "./image/Entry";
import { type StaticData } from "./staticData";

const AlbumPage = ({ albumId }: StaticData) => {
  const { data } = api.album.albumPageGetOne.useQuery(
    { albumId },
    { enabled: false },
  );
  const album = data as Album;

  return (
    <Layout>
      <AlbumProvider album={album}>
        <>
          <Titles />
          <div className="mt-8 md:mt-12">
            <Images />
          </div>
          <ImagesSwiper />
        </>
      </AlbumProvider>
      <button className="fixed top-2 left-1/2">SHOW SLIDER</button>
    </Layout>
  );
};

export default AlbumPage;

const Layout = ({ children }: { children: ReactElement | ReactElement[] }) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <div className="mt-20 flex justify-center md:mt-28">
        <div className="w-full max-w-[1800px] p-4 xs:p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

const Titles = () => {
  const album = useAlbumContext();

  return (
    <>
      <h1 className="text-6xl md:text-7xl">{album.title}</h1>
      {album.description ? (
        <p className="mt-4 max-w-[700px] font-serif">{album.description}</p>
      ) : null}
    </>
  );
};

const Images = () => {
  const album = useAlbumContext();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:gap-12">
      {album.images.slice(0, 5).map((albumImage) => (
        <AlbumImageProvider albumImage={albumImage} key={albumImage.id}>
          <AlbumImage />
        </AlbumImageProvider>
      ))}
    </div>
  );
};
