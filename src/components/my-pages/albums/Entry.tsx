/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { type ReactElement } from "react";
import Link from "next/link";

import { api } from "~/utils/api";
import ContainerMeasurements from "~/components/ContainerMeasurements";
import Header from "~/components/header/Entry";
import MyCldImage from "~/components/image/MyCldImage";
import SiteLayout from "~/components/layout/Site";
import { calcImgHeightForWidth } from "~/helpers/transformation";
import { type Album } from "./_types";

const AlbumsPage = () => (
  <SiteLayout pageTitle="Albums - Piros Photography">
    <PageLayout>
      <Titles />
      <div className="mt-8 pb-24 md:mt-12">
        <Albums />
      </div>
    </PageLayout>
  </SiteLayout>
);

export default AlbumsPage;

const PageLayout = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => (
  <div className="min-h-screen overflow-x-hidden">
    <Header />
    <div className="mt-24 flex justify-center md:mt-28">
      <div className="w-full max-w-[1800px] px-4 sm:px-8 xs:px-6">
        {children}
      </div>
    </div>
  </div>
);

const Titles = () => {
  const { data } = api.albumsPage.getText.useQuery(undefined, {
    enabled: false,
  });
  const pageText = data as NonNullable<typeof data>;

  return (
    <div>
      <h1 className="uppercase tracking-wider">
        <span className="text-5xl md:text-6xl">
          {pageText.title.slice(0, 1)}
        </span>
        <span className="text-4xl md:text-5xl">
          {pageText.title?.slice(1, pageText.title.length)}
        </span>
      </h1>
      {pageText.subTitle?.length ? (
        <h3 className="mt-3 max-w-[700px] font-serif-3 text-xl tracking-wide">
          {pageText.subTitle}
        </h3>
      ) : null}
    </div>
  );
};

const Albums = () => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as unknown as Album[];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
      {albums.map((album, i) => (
        <Album
          album={album}
          loading={i === 0 ? "eager" : "lazy"}
          key={album.id}
        ></Album>
      ))}
    </div>
  );
};

const Album = ({
  album,
  loading,
}: {
  album: Album;
  loading: "lazy" | "eager";
}) => (
  <Link href={`/albums/${album.id}`} passHref>
    <ContainerMeasurements>
      {(containerMeasurements) => {
        const height = calcImgHeightForWidth({
          containerWidth: containerMeasurements.width,
          image: {
            naturalHeight: album.coverImage.naturalHeight,
            naturalWidth: album.coverImage.naturalWidth,
          },
        });

        return (
          <>
            <h2 className="font-sans-secondary uppercase tracking-wider">
              <span className="text-xl">{album.title?.slice(0, 1)}</span>
              <span className="text-lg">
                {album.title?.slice(1, album.title.length)}
              </span>
            </h2>
            <div className="mt-1" style={{ height }}>
              <MyCldImage
                dimensions={{
                  height,
                  width: containerMeasurements.width,
                }}
                src={album.coverImage.cloudinary_public_id}
                loading={loading}
              />
            </div>
          </>
        );
      }}
    </ContainerMeasurements>
  </Link>
);
