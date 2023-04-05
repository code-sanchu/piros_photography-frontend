import { Fragment, useEffect, useRef, type ReactElement } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useWindowSize } from "@react-hookz/web";
import { animated, useSpring } from "@react-spring/web";

import WithTooltip from "~/components/WithTooltip";
import { CaretLeftIcon, CaretRightIcon } from "~/components/icon";
import { AlbumImageProvider, useAlbumContext } from "../_context";
import OpenedImage from "../image/opened-image/Entry";

// □ can make so no scroll to transition on open up swiper

const ImagesSwiper = ({
  imageIndex,
  setImageIndex,
  closeSwiper,
}: {
  imageIndex: number | null;
  setImageIndex: (index: number) => void;
  closeSwiper: () => void;
}) => {
  const album = useAlbumContext();

  const windowSize = useWindowSize();

  const [springs, springApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      translateX: -(windowSize.width * (imageIndex || 0)),
    },
  }));

  const animateToImg = (index: number) => {
    springApi.start({
      translateX: -(windowSize.width * index),
    });
  };

  useEffect(() => {
    if (typeof imageIndex !== "number") {
      return;
    }
    animateToImg(imageIndex);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageIndex, windowSize.width]);

  return (
    <>
      <Transition show={typeof imageIndex === "number"} as={Fragment}>
        <Dialog
          as="div"
          onClose={closeSwiper}
          className="fixed inset-0 z-30 bg-white"
        >
          <Transition.Child
            enter="ease-out duration-500"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DetectSwipe
              onSwipeLeft={() => {
                if (imageIndex === null) {
                  return;
                }
                const prevIndex =
                  imageIndex !== 0 ? imageIndex - 1 : album.images.length - 1;
                setImageIndex(prevIndex);
              }}
              onSwipeRight={() => {
                if (imageIndex === null) {
                  return;
                }
                const nextIndex =
                  imageIndex !== album.images.length - 1 ? imageIndex + 1 : 0;
                setImageIndex(nextIndex);
              }}
            >
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
                        unopenedDimensions={{ height: 800, width: 600 }}
                      />
                    </AlbumImageProvider>
                  </div>
                ))}
              </animated.div>
            </DetectSwipe>
          </Transition.Child>

          <button
            className="fixed right-3 top-3 text-sm"
            onClick={closeSwiper}
            type="button"
          >
            close
          </button>

          <WithTooltip text="previous image">
            <button
              className="fixed left-3 top-1/2 z-40 -translate-y-1/2 text-3xl text-gray-400 transition-colors duration-75 ease-in-out hover:text-gray-600"
              onClick={() => {
                if (imageIndex === null) {
                  return;
                }
                const prevIndex =
                  imageIndex !== 0 ? imageIndex - 1 : album.images.length - 1;
                setImageIndex(prevIndex);
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
                if (imageIndex === null) {
                  return;
                }
                const nextIndex =
                  imageIndex !== album.images.length - 1 ? imageIndex + 1 : 0;
                setImageIndex(nextIndex);
              }}
              type="button"
            >
              <CaretRightIcon />
            </button>
          </WithTooltip>
        </Dialog>
      </Transition>
    </>
  );
};

export default ImagesSwiper;

const DetectSwipe = ({
  children,
  onSwipeLeft,
  onSwipeRight,
}: {
  children: ReactElement;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) => {
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
        if (isLeftSwipe) {
          onSwipeLeft();
        } else if (isRightSwipe) {
          onSwipeRight;
        }
        console.log("swipe", isLeftSwipe ? "left" : "right");
        // add your conditional logic here
      }}
    >
      {children}
    </div>
  );
};
