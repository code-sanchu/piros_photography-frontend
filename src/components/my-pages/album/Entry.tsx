import { useState, type ReactElement } from "react";
import { useMeasure } from "@react-hookz/web";

import { api } from "~/utils/api";
import Header from "~/components/header/Entry";
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
        </>
      </AlbumProvider>
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
      <h1 className="font-sans-secondary font-medium uppercase tracking-wider">
        <span className="text-3xl">{album.title?.slice(0, 1)}</span>
        <span className="text-2xl">
          {album.title?.slice(1, album.title.length)}
        </span>
      </h1>
      {album.description ? (
        <p className="mt-3 max-w-[700px] font-serif-3 text-xl tracking-wide text-gray-900">
          {album.description}
        </p>
      ) : null}
    </>
  );
};

const Images = () => {
  const [swiperImageIndex, setSwiperImageIndex] = useState<number | null>(null);

  const album = useAlbumContext();

  const [imageContainerMeasurements, imageContainerRef] =
    useMeasure<HTMLDivElement>();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:gap-12">
        {album.images.map((albumImage, i) => (
          <AlbumImageProvider albumImage={albumImage} key={albumImage.id}>
            <div
              className="cursor-pointer"
              onClick={() => setSwiperImageIndex(i)}
              ref={imageContainerRef}
            >
              <AlbumImage />
            </div>
          </AlbumImageProvider>
        ))}
      </div>
      {imageContainerMeasurements ? (
        <ImagesSwiper
          closeSwiper={() => setSwiperImageIndex(null)}
          imageIndex={swiperImageIndex}
          setImageIndex={setSwiperImageIndex}
          unopenedImageContainerWidth={imageContainerMeasurements.height}
        />
      ) : null}
    </>
  );
};
