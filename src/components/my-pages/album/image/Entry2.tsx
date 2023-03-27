import { useState } from "react";
import {
  useIntersectionObserver,
  useMeasure,
  useWindowSize,
} from "@react-hookz/web";
import { animated, useSpring } from "@react-spring/web";

import {
  calcImgHeightForWidth,
  calcTransformDimensions,
  calcTransformDistanceToWindowCenter,
} from "~/helpers/transformation";
import { type Album } from "../_types";
import MyCldImage from "./MyCldImage";

const AlbumImage = ({ albumImage }: { albumImage: Album["images"][0] }) => {
  const [measurements, containerRef] = useMeasure<HTMLDivElement>();
  const intersection = useIntersectionObserver(containerRef);

  return (
    <div className="relative" ref={containerRef}>
      {measurements && intersection ? (
        <div
          style={{
            height: calcImgHeightForWidth({
              containerWidth: measurements.width,
              image: {
                naturalHeight: albumImage.image.naturalHeight,
                naturalWidth: albumImage.image.naturalWidth,
              },
            }),
          }}
        >
          <OnContainerWidthReady
            albumImage={albumImage}
            containerMeasurements={{
              pos: {
                x: intersection.boundingClientRect.x,
                y: intersection.boundingClientRect.y,
              },
              width: measurements.width,
            }}
          />
        </div>
      ) : null}

      <div className="fixed left-0 top-1/2 h-[1px] w-screen bg-red-900" />
    </div>
  );
};

export default AlbumImage;

const OnContainerWidthReady = ({
  albumImage,
  containerMeasurements,
}: {
  albumImage: Album["images"][0];
  containerMeasurements: {
    width: number;
    pos: {
      x: number;
      y: number;
    };
  };
}) => {
  const [openState, setOpenState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const [readMoreIsShowing, setReadMoreIsShowing] = useState(false);

  const windowSize = useWindowSize();

  const initialImageDimensions = {
    width: containerMeasurements.width,
    height: calcImgHeightForWidth({
      containerWidth: containerMeasurements.width,
      image: {
        naturalHeight: albumImage.image.naturalHeight,
        naturalWidth: albumImage.image.naturalWidth,
      },
    }),
  };

  const imageTitleHeight = 24;

  const transformedImageDimensions = calcTransformDimensions({
    initialDimensions: initialImageDimensions,
    transformTo: {
      maxDecimal: { height: 0.7, width: 0.8 },
      maxValue: { height: windowSize.height, width: windowSize.width },
      plusY: imageTitleHeight,
    },
  });

  const transformedImagePosition = calcTransformDistanceToWindowCenter({
    transformElement: {
      x: containerMeasurements.pos.x,
      y: containerMeasurements.pos.y,
      ...transformedImageDimensions,
    },
    windowSize,
  });

  const [imageSprings, imageApi] = useSpring(() => ({
    ...initialImageDimensions,
    x: 0,
    y: 0,
    config: { tension: 280, friction: 60 },
  }));

  function openImage() {
    setOpenState("opening");
    imageApi.start({
      ...transformedImageDimensions,
      ...transformedImagePosition,
      onResolve() {
        setOpenState("open");
      },
    });
  }

  function closeImage() {
    setOpenState("closing");

    imageApi.start({
      ...initialImageDimensions,
      x: 0,
      y: 0,
      onResolve() {
        setOpenState("closed");
      },
    });
  }

  return (
    <>
      <animated.div
        className="absolute h-full w-full cursor-pointer overflow-y-hidden bg-yellow-100"
        style={{
          ...imageSprings,
        }}
      >
        <div
          className={`flex w-full flex-col`}
          style={{
            aspectRatio:
              albumImage.image.naturalWidth / albumImage.image.naturalHeight,
          }}
        >
          {/* <div className="flex flex-grow flex-col"> */}
          <MyCldImage
            initialDimensions={initialImageDimensions}
            src={albumImage.image.cloudinary_public_id}
          />
          <button
            className="absolute top-0 left-0 z-10 bg-white"
            onClick={openImage}
          >
            Open
          </button>
          <button
            className="absolute top-0 right-0 z-10 bg-white"
            onClick={closeImage}
          >
            Close
          </button>
        </div>
        <div className="">
          <div className="flex gap-md">
            <h2>Image title</h2>
            <button
              className=""
              onClick={() => {
                if (!readMoreIsShowing) {
                  const readMoreHeight = 100;

                  imageApi.start({
                    to: {
                      height:
                        transformedImageDimensions.height + readMoreHeight,
                      y: transformedImagePosition.y - readMoreHeight / 2,
                    },
                  });

                  setReadMoreIsShowing(true);
                } else {
                  imageApi.start({
                    to: {
                      height: transformedImageDimensions.height,
                      y: transformedImagePosition.y,
                    },
                  });

                  setReadMoreIsShowing(false);
                }
              }}
            >
              read {readMoreIsShowing ? "less" : "more"}
            </button>
          </div>
          <div>I am read more</div>
        </div>
      </animated.div>
    </>
  );
};
