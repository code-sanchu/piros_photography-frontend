/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { type ReactElement } from "react";
import NextImage from "next/image";

import { type RouterOutputs } from "~/utils/api";
import Header from "~/components/header2/Entry";
import { localImage } from "~/assets/images";

type PageText = NonNullable<RouterOutputs["aboutPage"]["getText"]>;

const AlbumsPage = () => {
  return (
    <Layout>
      <BannerImage />
      <div className="mt-16"></div>
    </Layout>
  );
};

export default AlbumsPage;

const Layout = ({ children }: { children: ReactElement | ReactElement[] }) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header color="white" />
      {children}
    </div>
  );
};

const BannerImage = () => {
  return (
    <div className="relative h-[30vh]">
      <NextImage
        className={`absolute h-full w-full object-cover`}
        loading="eager"
        quality={100}
        src={localImage.aboutBanner}
        alt=""
      />
    </div>
  );
};
