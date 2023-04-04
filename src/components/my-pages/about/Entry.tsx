/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { type ReactElement } from "react";
import NextImage from "next/image";

import { api, type RouterOutputs } from "~/utils/api";
import Header from "~/components/header2/Entry";
import { localImage } from "~/assets/images";

type PageText = NonNullable<RouterOutputs["aboutPage"]["getText"]>;

const AlbumsPage = () => {
  return (
    <Layout>
      <BannerImage />
      <SocialLinks />
      <MainText />
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

const SocialLinks = () => {
  return (
    <div className="flex gap-12 px-4 pt-1 text-sm">
      <div className="flex gap-4">
        <p className="text-gray-400">contact</p>
        <a href="mailto:pirospixs@gmail.com" target="_blank">
          pirospixs@gmail.com
        </a>
      </div>
      <div className="flex gap-4">
        <p className="text-gray-400">facebook</p>
        <a href="https://www.facebook.com/SeeInPictures/" target="_blank">
          @seeinpictures
        </a>
      </div>
      <div className="flex gap-4">
        <p className="text-gray-400">youtube</p>
        <a
          href="https://www.youtube.com/playlist?list=PLdAjHO5OZG7y9CGvEG3Cf3ZgcaCL_p9fZ"
          target="_blank"
        >
          @piroska markus
        </a>
      </div>
    </div>
  );
};

const MainText = () => {
  const { data } = api.aboutPage.getText.useQuery(undefined, {
    enabled: false,
  });
  const textData = data as PageText;

  return (
    <div className="mt-16 flex justify-center">
      <p className="whitespace-pre-line font-serif">{textData.body}</p>
    </div>
  );
};