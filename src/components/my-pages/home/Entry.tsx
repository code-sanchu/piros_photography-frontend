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
      <MainImage />
      <MainTitle />
      <PageLinks />
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
      <div className="relative h-[90vh] w-[80vw]">{children}</div>
    </div>
  </>
);

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
          sizes="90vw"
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
          sizes="90vw"
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
          sizes="80vw"
          alt=""
          onLoad={() => setQualityImgIsLoaded(true)}
        />
      </div>
    </div>
  );
};

const MainTitle = () => (
  <h1 className="absolute top-[35%] -left-[3vw] text-4xl font-medium tracking-wider xs:text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl">
    Piros <br />
    Photography
  </h1>
);

const PageLinks = () => (
  <div className="mt-2 flex items-center justify-end gap-6">
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
