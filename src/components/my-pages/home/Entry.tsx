import { useState, type ReactElement } from "react";
import NextImage from "next/image";
import Link from "next/link";

import Header from "~/components/header/Entry";
import { SpinnerIcon } from "~/components/icon";
import SiteLayout from "~/components/layout/Site";
import { localImage } from "~/assets/images";

const HomePage = () => (
  <SiteLayout>
    <PageLayout>
      <div className="flex flex-col pb-2">
        <div className="h-[90vh] flex-grow">
          <MainImage />
        </div>
        <PageLinks />
      </div>
    </PageLayout>
  </SiteLayout>
);

export default HomePage;

const PageLayout = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => (
  <>
    <Header hideLogo hideUserMenu />
    <div className="flex justify-center">
      <div className="relative w-[80vw]">{children}</div>
    </div>
  </>
);

const MainImage = () => {
  const [minBlurImgIsLoaded, setMinBlurImgIsLoaded] = useState(false);
  const [midBlurImgIsLoaded, setMidBlurImgIsLoaded] = useState(false);
  const [qualityImgIsLoaded, setQualityImgIsLoaded] = useState(false);

  return (
    <div className="relative h-full bg-gray-50">
      <MainTitle />
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
        className={`absolute left-0 top-0 h-full w-full object-cover object-top ${
          qualityImgIsLoaded || midBlurImgIsLoaded ? "opacity-0" : "opacity-100"
        }`}
        loading="eager"
        quality={100}
        src={localImage.erith.blur.min}
        sizes="90vw"
        alt=""
        onLoad={() => setMinBlurImgIsLoaded(true)}
      />
      <NextImage
        className={`absolute left-0 top-0 h-full w-full object-cover object-top ${
          qualityImgIsLoaded || !midBlurImgIsLoaded
            ? "opacity-0"
            : "opacity-100"
        }`}
        loading="eager"
        quality={100}
        src={localImage.erith.blur.mid}
        sizes="90vw"
        alt=""
        onLoad={() => setMidBlurImgIsLoaded(true)}
      />
      <NextImage
        className={`absolute left-0 top-0 h-full w-full object-cover object-top ${
          !qualityImgIsLoaded ? "opacity-0" : "opacity-100"
        }`}
        loading="eager"
        quality={100}
        src={localImage.erith.full}
        sizes="80vw"
        alt=""
        onLoad={() => setQualityImgIsLoaded(true)}
      />
    </div>
  );
};

const MainTitle = () => (
  <h1 className="absolute top-[35%] -left-[3vw] z-10 flex-shrink-0 text-4xl font-medium tracking-wider sm:text-6xl xl:text-7xl 2xl:text-8xl xs:text-5xl">
    Piros <br />
    Photography
  </h1>
);

const PageLinks = () => (
  <div className="mt-2 flex items-center justify-end gap-4 text-sm tracking-wide sm:gap-6 xs:text-base">
    <PageLink href="/albums" text="Albums" />
    <PageLink href="/videos" text="Videos" />
    <PageLink href="/about" text="About" />
  </div>
);

const PageLink = ({ href, text }: { href: string; text: string }) => (
  <Link href={href} passHref>
    <div className="uppercase">{text}</div>
  </Link>
);
