import { Fragment, useEffect, type ReactElement } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useWindowSize } from "@react-hookz/web";
import { animated, useSpring } from "@react-spring/web";
import { signIn, useSession } from "next-auth/react";

import DetectSwipe from "~/components/DetectSwipe";
import { CaretLeftIcon, CaretRightIcon, XCircleIcon } from "~/components/icon";
import { calcImgHeightForWidth } from "~/helpers/transformation";
import { type ImageSwiper } from "../Entry";
import { AlbumImageProvider, useAlbumContext } from "../_context";
import SwiperImage from "./swiper-image/Entry";

const ImagesSwiper = ({
  imageSwiper,
  setImageSwiper,
  unopenedImageContainerWidth,
}: {
  imageSwiper: ImageSwiper;
  setImageSwiper: (imageSwiper: ImageSwiper) => void;
  unopenedImageContainerWidth: number;
}) => {
  const album = useAlbumContext();

  const windowSize = useWindowSize();

  const [springs, springApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      translateX: -(windowSize.width * (imageSwiper.index || 0)),
    },
  }));

  const animateToImg = (index: number) => {
    springApi.start({
      translateX: -(windowSize.width * index),
    });
  };

  useEffect(() => {
    if (imageSwiper.status === "closed") {
      return;
    }
    if (imageSwiper.status === "opening") {
      springApi.start({
        translateX: -(windowSize.width * imageSwiper.index),
        immediate: true,
      });
      setImageSwiper({ ...imageSwiper, status: "open" });
    } else if (imageSwiper.status === "open") {
      animateToImg(imageSwiper.index);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSwiper, windowSize.width]);

  const showNextImg = () => {
    if (imageSwiper.index === album.images.length - 1) {
      return;
    }

    const nextIndex =
      imageSwiper.index !== album.images.length - 1 ? imageSwiper.index + 1 : 0;
    setImageSwiper({ ...imageSwiper, index: nextIndex });
  };

  const showPreviousImg = () => {
    if (imageSwiper.index === 0) {
      return;
    }
    const prevIndex =
      imageSwiper.index !== 0 ? imageSwiper.index - 1 : album.images.length - 1;
    setImageSwiper({ ...imageSwiper, index: prevIndex });
  };

  return (
    <Transition
      show={imageSwiper.status === "opening" || imageSwiper.status === "open"}
      as={Fragment}
    >
      <Dialog
        onClose={() => setImageSwiper({ ...imageSwiper, status: "closed" })}
        onAnimationEnd={() =>
          setImageSwiper({ ...imageSwiper, status: "closed" })
        }
        className="fixed inset-0 z-30 "
      >
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
          <TopButtons
            closeModal={() =>
              setImageSwiper({ ...imageSwiper, status: "closed" })
            }
          />
        </TransitionChildFadeInOut>

        <TransitionChildFadeInOut>
          <CycleImgButton
            icon={<CaretLeftIcon weight="light" />}
            onClick={showPreviousImg}
            xPosClass="left-0.5 sm:left-1 md:left-3"
            isDisabled={imageSwiper.index === 0}
          />
        </TransitionChildFadeInOut>

        <TransitionChildFadeInOut>
          <CycleImgButton
            icon={<CaretRightIcon weight="light" />}
            onClick={showNextImg}
            xPosClass="right-0.5 sm:right-1 md:right-3"
            isDisabled={imageSwiper.index === album.images.length - 1}
          />
        </TransitionChildFadeInOut>
      </Dialog>
    </Transition>
  );
};

export default ImagesSwiper;

const TopButtons = ({ closeModal }: { closeModal: () => void }) => {
  const session = useSession();

  return (
    <div className="fixed right-3 top-3 flex items-center gap-6">
      {session.status === "unauthenticated" ? (
        <button
          className="text-sm tracking-wide text-blue-500 transition-colors duration-75 ease-in-out hover:text-blue-700"
          onClick={() => void signIn()}
          type="button"
        >
          Sign in
        </button>
      ) : null}
      <button
        className="flex items-center gap-1 text-sm tracking-wide text-gray-600 transition-colors duration-75 ease-in-out hover:text-gray-800"
        onClick={closeModal}
        type="button"
      >
        <span>close</span>
        <span className="text-lg">
          <XCircleIcon />
        </span>
      </button>
    </div>
  );
};

const CycleImgButton = ({
  icon,
  onClick,
  xPosClass,
  isDisabled,
}: {
  icon: ReactElement;
  onClick: () => void;
  xPosClass: string;
  isDisabled: boolean;
}) => {
  return (
    <button
      className={`fixed top-1/2 z-40 inline-block -translate-y-1/2 text-3xl text-gray-400 transition-all duration-75 ease-in-out hover:text-gray-600 ${xPosClass} ${
        isDisabled ? "opacity-20" : "opacity-100"
      }`}
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
