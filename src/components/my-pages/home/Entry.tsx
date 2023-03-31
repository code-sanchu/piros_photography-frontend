// import localFont from "next/font/local";

import { useState } from "react";
import NextImage from "next/image";
import Link from "next/link";

import { SpinnerIcon } from "~/components/icon";
import SiteLayout from "~/components/layout/Site";
import MainMenu from "~/components/main-menu";
import { localImage } from "~/assets/images";

// const fnFont = localFont({ src: "../fonts/fengardoneue_regular-webfont.woff" });

const HomePage = () => {
  return (
    <SiteLayout>
      <>
        <MainMenu />
        <PageContent />
      </>
    </SiteLayout>
  );
};

export default HomePage;

const PageContent = () => {
  return (
    <div className={`flex justify-center`}>
      <div className="relative h-[90vh] w-[80vw]">
        <MainImage />
        <MainTitle />
        <div className="mt-2 flex items-center justify-end gap-6">
          <PageLink href="/albums" text="Albums" />
          <PageLink href="" text="Videos" />
          <PageLink href="" text="About" />
        </div>
      </div>
    </div>
  );
};

const MainImage = () => {
  const [minBlurImgIsLoaded, setMinBlurImgIsLoaded] = useState(false);
  const [midBlurImgIsLoaded, setMidBlurImgIsLoaded] = useState(false);
  const [qualityImgIsLoaded, setQualityImgIsLoaded] = useState(false);

  return (
    <div className="grid h-full flex-grow place-items-center">
      <div className="relative h-full w-full bg-gray-50">
        <div
          className={`transition-opacity my-abs-center ${
            !minBlurImgIsLoaded && !midBlurImgIsLoaded && !qualityImgIsLoaded
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <SpinnerIcon />
        </div>
        <NextImage
          className={`absolute left-0 top-0 h-full w-full object-cover ${
            qualityImgIsLoaded || midBlurImgIsLoaded
              ? "opacity-0"
              : "opacity-100"
          }`}
          loading="eager"
          quality={100}
          src={localImage.erith.blur.min}
          alt=""
          onLoad={() => setMinBlurImgIsLoaded(true)}
        />
        <NextImage
          className={`absolute left-0 top-0 h-full w-full object-cover ${
            qualityImgIsLoaded || !midBlurImgIsLoaded
              ? "opacity-0"
              : "opacity-100"
          }`}
          loading="eager"
          quality={100}
          src={localImage.erith.blur.mid}
          alt=""
          onLoad={() => setMidBlurImgIsLoaded(true)}
        />
        <NextImage
          className={`absolute left-0 top-0 h-full w-full object-cover ${
            !qualityImgIsLoaded ? "opacity-0" : "opacity-100"
          }`}
          loading="eager"
          quality={100}
          src={localImage.erith.full}
          alt=""
          onLoad={() => setQualityImgIsLoaded(true)}
        />
      </div>
    </div>
  );
};

const MainTitle = () => {
  return (
    <h1 className="absolute top-[35%] -left-[80px] text-7xl tracking-wider">
      Piros <br />
      Photography
    </h1>
  );
};

const PageLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <Link href={href} passHref>
      <div className="uppercase">{text}</div>
    </Link>
  );
};
