import { useRef, useState, type ReactElement } from "react";
import { useMeasure, useWindowSize } from "@react-hookz/web";
import { animated, useSpring } from "@react-spring/web";

import WithTooltip from "~/components/WithTooltip";
import { CaretLeftIcon, CaretRightIcon } from "~/components/icon";
import { AlbumImageProvider, useAlbumContext } from "../_context";
import OpenedImage from "../image/opened-image/Entry";

const DetectSwipe = ({ children }: { children: ReactElement }) => {
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  return (
    <div
      onTouchStart={(e) => {
        touchEndRef.current = null;
        if (e.targetTouches[0]) {
          touchStartRef.current = e.targetTouches[0].clientX;
        }
      }}
      onTouchMove={(e) => {
        if (e.targetTouches[0]) {
          touchEndRef.current = e.targetTouches[0].clientX;
        }
      }}
      onTouchEnd={() => {
        const minSwipeDistance = 50;

        if (!touchStartRef.current || !touchEndRef.current) return;
        const distance = touchStartRef.current - touchEndRef.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe || isRightSwipe)
          console.log("swipe", isLeftSwipe ? "left" : "right");
        // add your conditional logic here
      }}
    >
      {children}
    </div>
  );
};

const ImagesSwiper = () => {
  // useRef instead
  const [index, setIndex] = useState(0);

  const album = useAlbumContext();

  const windowSize = useWindowSize();

  const [springs, springApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      translateX: 0,
    },
  }));

  const animateToNextImg = (index: number) => {
    springApi.start({
      translateX: -(windowSize.width * index),
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40">
        <DetectSwipe>
          <animated.div
            className={`relative flex h-screen w-screen`}
            style={{ ...springs }}
          >
            {album.images.map((albumImage) => (
              <div
                className="h-screen w-screen shrink-0 bg-white"
                key={albumImage.id}
              >
                <AlbumImageProvider albumImage={albumImage}>
                  <OpenedImage
                    closeImage={() => null}
                    unopenedDimensions={{ height: 800, width: 600 }}
                  />
                </AlbumImageProvider>
              </div>
            ))}
          </animated.div>
        </DetectSwipe>
      </div>
      <WithTooltip text="previous image">
        <button
          className="fixed left-3 top-1/2 z-40 -translate-y-1/2 text-3xl text-gray-400 transition-colors duration-75 ease-in-out hover:text-gray-600"
          onClick={() => {
            const prevIndex = index !== 0 ? index - 1 : album.images.length - 1;
            setIndex(prevIndex);
            animateToNextImg(prevIndex);
          }}
          type="button"
        >
          <CaretLeftIcon />
        </button>
      </WithTooltip>
      <WithTooltip text="next image">
        <button
          className="fixed right-3 top-1/2 z-40 -translate-y-1/2 text-3xl text-gray-400 transition-colors duration-75 ease-in-out hover:text-gray-600"
          onClick={() => {
            const nextIndex = index !== album.images.length - 1 ? index + 1 : 0;
            setIndex(nextIndex);
            animateToNextImg(nextIndex);
          }}
          type="button"
        >
          <CaretRightIcon />
        </button>
      </WithTooltip>
    </>
  );
};

export default ImagesSwiper;
