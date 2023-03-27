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
            containerWidth={measurements.width}
            left={intersection.boundingClientRect.left}
            top={intersection.boundingClientRect.top}
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
  containerWidth,
  left,
  top,
}: {
  containerWidth: number;
  albumImage: Album["images"][0];
  left: number;
  top: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openState, setOpenState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const [readMore, setReadMore] = useState(false);

  const windowSize = useWindowSize();

  const initialImageDimensions = {
    width: containerWidth,
    height: calcImgHeightForWidth({
      containerWidth,
      image: {
        naturalHeight: albumImage.image.naturalHeight,
        naturalWidth: albumImage.image.naturalWidth,
      },
    }),
  };

  const transformedImageDimensions = calcTransformDimensions({
    initialDimensions: initialImageDimensions,
    transformTo: {
      maxDecimal: { height: 0.7, width: 0.8 },
      maxValue: { height: windowSize.height, width: windowSize.width },
    },
  });

  const transformedImagePosition = calcTransformDistanceToWindowCenter({
    transformElement: { x: left, y: top, ...transformedImageDimensions },
    windowSize,
  });

  const [imageSprings, imageApi] = useSpring<{
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  }>(() => ({
    ...initialImageDimensions,
    x: 0,
    y: 0,
    config: { tension: 280, friction: 60 },
  }));

  const [titleMeasurements, titleRef] = useMeasure<HTMLDivElement>();
  const [readMoreMeasurements, readMoreRef] = useMeasure<HTMLDivElement>();

  console.log("titleMeasurements:", titleMeasurements?.height);

  const imageOpenYPosInitial =
    transformedImagePosition.y - (titleMeasurements?.height || 1) / 2;

  const imageTextPosYInitial =
    imageOpenYPosInitial + transformedImageDimensions.height;

  const [imageTextSprings, imageTextApi] = useSpring(() => ({
    opacity: 0,
    height: titleMeasurements?.height,
    x: transformedImagePosition.x,
    y: imageTextPosYInitial,
    config: { tension: 280, friction: 60 },
  }));

  function openImage() {
    setOpenState("opening");
    imageApi.start({
      ...transformedImageDimensions,
      x: transformedImagePosition.x,
      y: imageOpenYPosInitial,
      onResolve() {
        setOpenState("open");
        imageTextApi.start({
          opacity: 100,
        });
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
        className="absolute flex h-full w-full cursor-pointer flex-col bg-yellow-100"
        style={{
          zIndex:
            isHovered ||
            openState === "opening" ||
            openState === "open" ||
            openState === "closing"
              ? 50
              : 0,
          ...imageSprings,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex flex-grow flex-col"
          style={{ maxHeight: transformedImageDimensions.height }}
        >
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
      </animated.div>
      <animated.div
        className={`overflow-y-hidden bg-red-50 ${
          openState === "open" ? "pointer-events-auto" : "pointer-events-none"
        }`}
        // className="absolute bottom-0 w-full translate-y-full overflow-y-hidden bg-red-50"
        style={imageTextSprings}
      >
        <div className="flex">
          <h2 ref={titleRef}>Image Title</h2>
          <button
            className="bg-white"
            onClick={() => {
              if (!readMore) {
                setReadMore(true);
                imageApi.start({
                  y: imageOpenYPosInitial - 200 / 2,
                });
                imageTextApi.start({
                  height: 200,
                  y:
                    imageOpenYPosInitial +
                    transformedImageDimensions.height -
                    200 / 2,
                });
              } else {
                setReadMore(false);
                imageTextApi.start({
                  height: titleMeasurements?.height || 1,
                });
              }
            }}
          >
            Read more
          </button>
        </div>
        <div className="pt-2" ref={readMoreRef}>
          I am read more
        </div>
      </animated.div>
    </>
  );
};
