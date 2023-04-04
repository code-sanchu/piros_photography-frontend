/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Fragment, type ReactElement } from "react";
import Link from "next/link";
import { useMeasure } from "react-use";

import { api, type RouterOutputs } from "~/utils/api";
import Header from "~/components/header2/Entry";
import MyCldImage from "~/components/image/MyCldImage";
import { calcImgHeightForWidth } from "~/helpers/transformation";
import { type MyOmit } from "~/types/utilities";

type RouterAlbum = RouterOutputs["album"]["albumsPageGetAll"][0];
// albums query filters for cover image, but prisma doesn't give correct type. See issue [https://github.com/prisma/prisma/discussions/2772].
type Album = MyOmit<RouterAlbum, "coverImage"> & {
  coverImage: NonNullable<RouterAlbum["coverImage"]>;
};

const AlbumsPage = () => {
  return (
    <Layout>
      <div className="mt-8">
        <Titles />
      </div>
      <div className="mt-12">
        <Albums />
      </div>
    </Layout>
  );
};

export default AlbumsPage;

const Layout = ({ children }: { children: ReactElement | ReactElement[] }) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <div className="mt-16 flex justify-center">
        <div className="w-full max-w-[1800px] p-8">{children}</div>
      </div>
    </div>
  );
};

const Titles = () => {
  const { data } = api.albumsPage.getText.useQuery(undefined, {
    enabled: false,
  });
  const pageText = data as NonNullable<typeof data>;

  return (
    <div>
      <h1 className="text-7xl">{pageText.title}</h1>
      {pageText.subTitle?.length ? (
        <h3 className="text-4xl">{pageText.subTitle}</h3>
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
    <div className="grid grid-cols-2 gap-8">
      {albums.map((album) => (
        <Album album={album} key={album.id}></Album>
      ))}
    </div>
  );
};

const Album = ({ album }: { album: Album }) => {
  const [containerRef, { width: containerWidth }] =
    useMeasure<HTMLDivElement>();

  return (
    <Link href={`/albums/${album.id}`} passHref>
      <div className="group/album" ref={containerRef}>
        {containerWidth
          ? [0].map((_, i) => {
              const height = calcImgHeightForWidth({
                containerWidth,
                image: {
                  naturalHeight: album.coverImage.naturalHeight,
                  naturalWidth: album.coverImage.naturalWidth,
                },
              });

              return (
                <Fragment key={i}>
                  <div className="text-lg text-gray-700 transition-colors duration-75 ease-in-out group-hover/album:text-gray-900">
                    {album.title}
                  </div>
                  <div className="mt-1" style={{ height }}>
                    <MyCldImage
                      dimensions={{
                        height,
                        width: containerWidth,
                      }}
                      src={album.coverImage.cloudinary_public_id}
                    />
                  </div>
                </Fragment>
              );
            })
          : null}
      </div>
    </Link>
  );
};
