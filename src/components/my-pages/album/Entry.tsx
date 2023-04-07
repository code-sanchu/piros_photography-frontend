/* eslint-disable jsx-a11y/alt-text */
import { useState, type ReactElement } from "react";
import { useMeasure } from "@react-hookz/web";

import { api } from "~/utils/api";
import Header from "~/components/header/Entry";
import SiteLayout from "~/components/layout/Site";
import Image from "./Image";
import { AlbumImageProvider, AlbumProvider, useAlbumContext } from "./_context";
import { type Album } from "./_types";
import ImagesSwiper from "./image-swiper/Entry";
import { type StaticData } from "./staticData";

const AlbumPage = ({ albumId }: StaticData) => {
  const { data } = api.album.albumPageGetOne.useQuery(
    { albumId },
    { enabled: false },
  );
  const album = data as Album;

  return (
    <SiteLayout>
      <Layout>
        <AlbumProvider album={album}>
          <>
            <Titles />
            <div className="mt-10">
              <Images />
            </div>
          </>
        </AlbumProvider>
      </Layout>
    </SiteLayout>
  );
};

export default AlbumPage;

const Layout = ({ children }: { children: ReactElement | ReactElement[] }) => (
  <div className="min-h-screen overflow-x-hidden">
    <Header />
    <div className="mt-20 flex justify-center md:mt-28">
      <div className="w-full max-w-[1800px] px-4 xs:px-6 sm:px-8">
        {children}
      </div>
    </div>
  </div>
);

const Titles = () => {
  const album = useAlbumContext();

  return (
    <>
      <h1 className="font-sans-secondary font-medium uppercase tracking-wider">
        <span className="text-2xl sm:text-3xl">{album.title?.slice(0, 1)}</span>
        <span className="text-xl tracking-widest sm:text-2xl">
          {album.title?.slice(1, album.title.length)}
        </span>
      </h1>
      {album.description ? (
        <p className="mt-5 max-w-[680px] font-serif-3 text-lg leading-6 text-gray-900 sm:text-xl">
          {album.description}
        </p>
      ) : null}
    </>
  );
};

export type ImageSwiper = {
  status: "open" | "closed" | "opening";
  // status: "open" | "closed" | "opening" | "closing";
  index: number;
};

const Images = () => {
  const [imageSwiper, setImageSwiper] = useState<ImageSwiper>({
    status: "closed",
    index: 0,
  });

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
              onClick={() => setImageSwiper({ status: "opening", index: i })}
              ref={imageContainerRef}
            >
              <Image />
            </div>
          </AlbumImageProvider>
        ))}
      </div>
      {imageContainerMeasurements ? (
        <ImagesSwiper
          imageSwiper={imageSwiper}
          setImageSwiper={setImageSwiper}
          unopenedImageContainerWidth={imageContainerMeasurements.height}
        />
      ) : null}
    </>
  );
};
