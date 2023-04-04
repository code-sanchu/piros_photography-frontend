import { useState } from "react";
import Link from "next/link";
import { animated, useSpring, type SpringValue } from "@react-spring/web";

import UserMenu from "./user/Entry";

const Header = () => {
  const [panelSprings, panelSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      translateX: "100%",
    },
  }));

  return (
    <>
      <div className="fixed left-0 top-0 z-40 flex w-full items-center justify-between p-4">
        <Logo />
        <RightSide
          closePanelAnimation={() =>
            panelSpringApi.start({
              translateX: "100%",
            })
          }
          startPanelAnimation={() =>
            panelSpringApi.start({
              translateX: "0%",
            })
          }
        />
      </div>
      <MenuPanel panelSprings={panelSprings} />
    </>
  );
};

export default Header;

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

const RightSide = ({
  closePanelAnimation,
  startPanelAnimation,
}: {
  startPanelAnimation: () => void;
  closePanelAnimation: () => void;
}) => {
  return (
    <div className="flex items-center gap-8">
      <div style={{ height: 33.2 }}>
        <UserMenu />
      </div>
      <SiteMenu
        closePanelAnimation={closePanelAnimation}
        startPanelAnimation={startPanelAnimation}
      />
    </div>
  );
};

const SiteMenu = ({
  closePanelAnimation,
  startPanelAnimation,
}: {
  startPanelAnimation: () => void;
  closePanelAnimation: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
    startPanelAnimation();
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
    closePanelAnimation();
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
        className="flex cursor-pointer flex-col gap-1 p-1"
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
    </>
  );
};

const MenuPanel = ({
  panelSprings,
}: {
  panelSprings: Record<string, SpringValue<string>>;
}) => {
  return (
    <animated.div
      className="fixed inset-0 z-30 bg-white p-8"
      style={{ ...panelSprings }}
    >
      <div className="flex justify-center">
        <div className="mt-32 flex w-[80%] items-center justify-between">
          <PageLinks />
          <Socials />
        </div>
      </div>
    </animated.div>
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
