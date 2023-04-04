import { useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { animated, useSpring } from "@react-spring/web";

import { SpinnerIcon } from "~/components/icon";
import SiteLayout from "~/components/layout/Site";
// import MainMenu from "~/components/main-menu";
import { localImage } from "~/assets/images";

// Side menu
// - links: home, albums, videos, about
// - account?
// - about info. eg. social links.

const HomePage = () => {
  return (
    <SiteLayout>
      <>
        <PageContent />
        <Menu />
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
          <PageLink href="/videos" text="Videos" />
          <PageLink href="/about" text="About" />
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
    <h1 className="absolute top-[35%] -left-[80px] text-7xl font-medium tracking-wider">
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

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [panelSprings, panelSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      translateX: "100%",
    },
  }));

  const [buttonTopBarSprings, buttonTopBarSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      rotate: 0,
      translateY: 0,
    },
  }));
  const [buttonMidBarSprings, buttonMidBarSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      opacity: 1,
    },
  }));
  const [buttonBottomBarSprings, buttonBottomBarSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      rotate: 0,
      translateY: 0,
    },
  }));

  const openMenu = () => {
    panelSpringApi.start({
      translateX: "0%",
    });
    buttonTopBarSpringApi.start({
      rotate: 45,
      translateY: 8,
    });
    buttonMidBarSpringApi.start({
      opacity: 0,
    });
    buttonBottomBarSpringApi.start({
      rotate: -45,
      translateY: -8,
    });
    setIsOpen(true);
  };

  const closeMenu = () => {
    panelSpringApi.start({
      translateX: "100%",
    });
    buttonTopBarSpringApi.start({
      rotate: 0,
      translateY: 0,
    });
    buttonMidBarSpringApi.start({
      opacity: 1,
    });
    buttonBottomBarSpringApi.start({
      rotate: 0,
      translateY: 0,
    });
    setIsOpen(false);
  };

  return (
    <>
      <div
        className="fixed top-4 right-4 z-50 flex cursor-pointer flex-col gap-1 p-1"
        onClick={() => {
          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
      >
        <animated.div
          className="h-[2px] w-[26px] bg-black"
          style={{ ...buttonTopBarSprings }}
        />
        <animated.div
          className="h-[2px] w-[26px] bg-black"
          style={{ ...buttonMidBarSprings }}
        />
        <animated.div
          className="h-[2px] w-[26px] bg-black"
          style={{ ...buttonBottomBarSprings }}
        />
      </div>
      <animated.div
        className="fixed inset-0 z-40 bg-white p-8"
        style={{ ...panelSprings }}
      >
        <Logo />
        <div className="flex justify-center">
          <div className="mt-32 flex w-[80%] items-center justify-between">
            <PageLinks />
            <Socials />
          </div>
        </div>
      </animated.div>
    </>
  );
};

const Logo = () => {
  return (
    <Link href="/" passHref>
      <h2 className="uppercase tracking-widest">
        <span className="text-xl">P</span>iros
        <br />
        <span className="text-xl">P</span>hotography
      </h2>
    </Link>
  );
};

const PageLinks = () => {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col gap-6">
        <Link href={"/"} passHref>
          <p className="text-4xl tracking-wide">Home</p>
        </Link>
        <Link href={"/albums"} passHref>
          <p className="text-4xl tracking-wide">Albums</p>
        </Link>
        <Link href={"/videos"} passHref>
          <p className="text-4xl tracking-wide">Videos</p>
        </Link>
        <Link href={"/about"} passHref>
          <p className="text-4xl tracking-wide">About</p>
        </Link>
      </div>
    </div>
  );
};

const Socials = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-8">
        <p className="text-gray-600">contact</p>
        <a href="mailto:pirospixs@gmail.com" target="_blank">
          pirospixs@gmail.com
        </a>
      </div>
      <div className="flex gap-8">
        <p className="text-gray-600">facebook</p>
        <a href="https://www.facebook.com/SeeInPictures/" target="_blank">
          @seeinpictures
        </a>
      </div>
      <div className="flex gap-4">
        <p className="text-gray-600">youtube</p>
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
