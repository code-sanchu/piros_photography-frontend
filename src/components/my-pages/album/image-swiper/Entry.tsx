import { Fragment, useEffect, type ReactElement } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useWindowSize } from "@react-hookz/web";
import { animated, useSpring } from "@react-spring/web";

import DetectSwipe from "~/components/DetectSwipe";
import { CaretLeftIcon, CaretRightIcon } from "~/components/icon";
import { calcImgHeightForWidth } from "~/helpers/transformation";
import { AlbumImageProvider, useAlbumContext } from "../_context";
import SwiperImage from "./swiper-image/Entry";

// □ could make so no scroll to transition on open up swiper

const ImagesSwiper = ({
  imageIndex,
  setImageIndex,
  closeSwiper,
  unopenedImageContainerWidth,
}: {
  imageIndex: number | null;
  setImageIndex: (index: number) => void;
  closeSwiper: () => void;
  unopenedImageContainerWidth: number;
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

  const showNextImg = () => {
    if (imageIndex === null) {
      return;
    }
    const nextIndex =
      imageIndex !== album.images.length - 1 ? imageIndex + 1 : 0;
    setImageIndex(nextIndex);
  };

  const showPreviousImg = () => {
    if (imageIndex === null) {
      return;
    }
    const prevIndex =
      imageIndex !== 0 ? imageIndex - 1 : album.images.length - 1;
    setImageIndex(prevIndex);
  };

  return (
    <Transition show={typeof imageIndex === "number"} as={Fragment}>
      <Dialog onClose={closeSwiper} className="fixed inset-0 z-30 ">
        <Transition.Child
          as="div"
          className="bg-white"
          enter="ease-out duration-500"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DetectSwipe onSwipeLeft={showNextImg} onSwipeRight={showPreviousImg}>
            <animated.div className={`flex`} style={{ ...springs }}>
              {album.images.map((albumImage) => (
                <div key={albumImage.id}>
                  <AlbumImageProvider albumImage={albumImage}>
                    <SwiperImage
                      unopenedDimensions={{
                        height: calcImgHeightForWidth({
                          containerWidth: unopenedImageContainerWidth,
                          image: {
                            naturalHeight: albumImage.image.naturalHeight,
                            naturalWidth: albumImage.image.naturalWidth,
                          },
                        }),
                        width: unopenedImageContainerWidth,
                      }}
                    />
                  </AlbumImageProvider>
                </div>
              ))}
            </animated.div>
          </DetectSwipe>
        </Transition.Child>

        <TransitionChildFadeInOut>
          <button
            className="fixed right-3 top-3 font-sans-secondary text-sm tracking-wide"
            onClick={closeSwiper}
            type="button"
          >
            close
          </button>
        </TransitionChildFadeInOut>

        <TransitionChildFadeInOut>
          <CycleImgButton
            icon={<CaretLeftIcon />}
            onClick={showPreviousImg}
            xPosClass="left-0.5 sm:left-1 md:left-3"
          />
        </TransitionChildFadeInOut>

        <TransitionChildFadeInOut>
          <CycleImgButton
            icon={<CaretRightIcon />}
            onClick={showNextImg}
            xPosClass="right-0.5 sm:right-1 md:right-3"
          />
        </TransitionChildFadeInOut>
      </Dialog>
    </Transition>
  );
};

export default ImagesSwiper;

const CycleImgButton = ({
  icon,
  onClick,
  xPosClass,
}: {
  icon: ReactElement;
  onClick: () => void;
  xPosClass: string;
}) => {
  return (
    <button
      className={`fixed top-1/2 z-40 inline-block -translate-y-1/2 text-3xl text-gray-400 transition-colors duration-75 ease-in-out hover:text-gray-600 ${xPosClass}`}
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  );
};

const TransitionChildFadeInOut = ({ children }: { children: ReactElement }) => {
  return (
    <Transition.Child
      as="span"
      className="inline-block"
      enter="ease-out duration-500"
      enterFrom="opacity-0 "
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition.Child>
  );
};
