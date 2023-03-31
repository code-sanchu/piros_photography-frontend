import { useRef, useState } from "react";
import {
  useClickOutside,
  useIntersectionObserver,
  useMeasure,
  useWindowSize,
} from "@react-hookz/web";
import { animated, useSpring } from "@react-spring/web";

import {
  calcDimensions,
  calcImgHeightForWidth,
  calcTransformDistanceToWindowCenter,
} from "~/helpers/transformation";
import {
  ContainerMeasurementsProvider,
  useAlbumImageContext,
  useContainerMeasurementsContext,
} from "../_context";
import MyCldImage from "./MyCldImage";
import AboutImageAndComments, {
  ReadMore,
  TopBar,
} from "./about-and-comments/Entry";

// ! change cld image size on open image. Happens automatically?

const AlbumImage = () => {
  const [containerMeasurements, containerRef] = useMeasure<HTMLDivElement>();
  const containerIntersection = useIntersectionObserver(containerRef);

  return (
    <div className="relative" ref={containerRef}>
      {containerMeasurements && containerIntersection ? (
        <ContainerMeasurementsProvider
          pos={{
            x: containerIntersection.boundingClientRect.x,
            y: containerIntersection.boundingClientRect.y,
          }}
          width={containerMeasurements.width}
        >
          <OnContainerMeasurementsReady />
        </ContainerMeasurementsProvider>
      ) : null}
    </div>
  );
};

export default AlbumImage;

const useInitialDimensions = () => {
  const albumImage = useAlbumImageContext();
  const containerMeasurements = useContainerMeasurementsContext();

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

  return initialImageDimensions;
};

const OnContainerMeasurementsReady = () => {
  const albumImage = useAlbumImageContext();
  const containerMeasurements = useContainerMeasurementsContext();
  const initialImageDimensions = useInitialDimensions();

  const windowSize = useWindowSize();

  const transformWidth = calcDimensions({
    initialDimensions: initialImageDimensions,
    transformTo: {
      maxDecimal: { height: 0.7, width: 0.8 },
      maxValue: { height: windowSize.height, width: windowSize.width },
    },
  }).width;

  const [titleMeasurements, titleRef] = useMeasure<HTMLDivElement>();
  const [readMoreMeasurements, readMoreRef] = useMeasure<HTMLDivElement>();

  return (
    <div
      style={{
        height: calcImgHeightForWidth({
          containerWidth: containerMeasurements.width,
          image: {
            naturalHeight: albumImage.image.naturalHeight,
            naturalWidth: albumImage.image.naturalWidth,
          },
        }),
      }}
    >
      <div className="invisible fixed" style={{ width: transformWidth }}>
        <div ref={titleRef}>
          <TopBar />
        </div>
        <div ref={readMoreRef}>
          <ReadMore />
        </div>
      </div>
      {titleMeasurements && readMoreMeasurements ? (
        <OnAllMeasurementsReady
          titleHeight={titleMeasurements.height}
          readMoreHeight={readMoreMeasurements.height}
        />
      ) : null}
    </div>
  );
};

const OnAllMeasurementsReady = ({
  titleHeight,
}: // readMoreHeight,
{
  titleHeight: number;
  readMoreHeight: number;
}) => {
  const albumImage = useAlbumImageContext();

  const [isHovered, setIsHovered] = useState(false);
  const [openState, setOpenState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const [readMoreIsShowing, setReadMoreIsShowing] = useState(false);

  const windowSize = useWindowSize();

  const readMoreHeight = 400;

  const containerMeasurements = useContainerMeasurementsContext();
  const initialImageDimensions = useInitialDimensions();

  const transformedImageDimensionsInitial = useRef(
    calcDimensions({
      initialDimensions: initialImageDimensions,
      transformTo: {
        maxDecimal: { height: 0.7, width: 0.8 },
        maxValue: { height: windowSize.height, width: windowSize.width },
        plusY: titleHeight + (readMoreIsShowing ? readMoreHeight : 0),
      },
    }),
  ).current;

  const transformedImagePositionInitial = useRef(
    calcTransformDistanceToWindowCenter({
      measurements: {
        x: containerMeasurements.pos.x,
        y: containerMeasurements.pos.y,
        ...transformedImageDimensionsInitial,
      },
      windowSize,
    }),
  ).current;

  const transformedImageDimensionsReadMoreOpen = useRef(
    calcDimensions({
      initialDimensions: initialImageDimensions,
      transformTo: {
        maxDecimal: { height: 0.7, width: 0.8 },
        maxValue: { height: windowSize.height, width: windowSize.width },
        plusY: titleHeight + readMoreHeight,
      },
    }),
  ).current;

  const transformedImagePositionReadMoreOpen = useRef(
    calcTransformDistanceToWindowCenter({
      measurements: {
        x: containerMeasurements.pos.x,
        y: containerMeasurements.pos.y,
        ...transformedImageDimensionsReadMoreOpen,
      },
      windowSize,
    }),
  ).current;

  const [imageSprings, imageApi] = useSpring(() => ({
    ...initialImageDimensions,
    x: 0,
    y: 0,
    config: { tension: 280, friction: 60 },
  }));

  const [bgSprings, bgApi] = useSpring(() => ({
    opacity: 0,
    config: { tension: 280, friction: 60 },
  }));

  function openImage() {
    setOpenState("opening");

    const dimensions = !readMoreIsShowing
      ? transformedImageDimensionsInitial
      : transformedImageDimensionsReadMoreOpen;
    const position = !readMoreIsShowing
      ? transformedImagePositionInitial
      : transformedImagePositionReadMoreOpen;

    imageApi.start({
      ...dimensions,
      ...position,
      onResolve() {
        setOpenState("open");
      },
    });

    bgApi.start({
      opacity: 1,
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

    bgApi.start({
      opacity: 0,
    });
  }

  const containerRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(containerRef, () => {
    if (openState === "closed" || openState === "closing") {
      return;
    }
    closeImage();
  });

  return (
    <>
      <animated.div
        className={`absolute h-full w-full overflow-y-hidden ${
          openState === "closed" ? "cursor-pointer" : ""
        }`}
        style={{
          ...imageSprings,
          zIndex:
            isHovered ||
            openState === "opening" ||
            openState === "open" ||
            openState === "closing"
              ? 50
              : 0,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (openState === "open" || openState === "opening") {
            return;
          }
          openImage();
        }}
        ref={containerRef}
      >
        <div
          className={`flex w-full flex-col`}
          style={{
            aspectRatio:
              albumImage.image.naturalWidth / albumImage.image.naturalHeight,
          }}
        >
          <MyCldImage
            initialDimensions={initialImageDimensions}
            src={albumImage.image.cloudinary_public_id}
          />
        </div>
        <AboutImageAndComments
          handleShowReadMore={() => {
            if (!readMoreIsShowing) {
              imageApi.start({
                to: {
                  height:
                    transformedImageDimensionsInitial.height + readMoreHeight,
                  y: transformedImagePositionInitial.y - readMoreHeight / 2,
                },
              });

              setReadMoreIsShowing(true);
            } else {
              imageApi.start({
                to: {
                  height: transformedImageDimensionsInitial.height,
                  y: transformedImagePositionInitial.y,
                },
              });

              setReadMoreIsShowing(false);
            }
          }}
          readMoreIsShowing={readMoreIsShowing}
        />
      </animated.div>
      <animated.div
        className="fixed top-0 left-0 -z-10 h-screen w-screen bg-gray-50/70"
        style={{
          ...bgSprings,
          zIndex:
            openState === "opening" ||
            openState === "open" ||
            openState === "closing"
              ? 10
              : -10,
        }}
      />
    </>
  );
};
