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
import {
  ContainerMeasurementsProvider,
  useAlbumImageContext,
  useContainerMeasurementsContext,
} from "../_context";
import MyCldImage from "./MyCldImage";

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

  const transformWidth = calcTransformDimensions({
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
          <Title />
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
  readMoreHeight,
}: {
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

  const initialImageDimensions = useInitialDimensions();
  const containerMeasurements = useContainerMeasurementsContext();

  // const imageTitleHeight = 24;

  const transformedImageDimensions = calcTransformDimensions({
    initialDimensions: initialImageDimensions,
    transformTo: {
      maxDecimal: { height: 0.7, width: 0.8 },
      maxValue: { height: windowSize.height, width: windowSize.width },
      plusY: titleHeight,
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
    <animated.div
      className="absolute h-full w-full cursor-pointer overflow-y-hidden"
      style={{
        ...imageSprings,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex w-full flex-col`}
        style={{
          zIndex:
            isHovered ||
            openState === "opening" ||
            openState === "open" ||
            openState === "closing"
              ? 50
              : 0,
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
          <Title />
          <button
            className=""
            onClick={() => {
              if (!readMoreIsShowing) {
                imageApi.start({
                  to: {
                    height: transformedImageDimensions.height + readMoreHeight,
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
        <div>
          <ReadMore />
        </div>
      </div>
    </animated.div>
  );
};

const Title = () => {
  return <h2>Image title</h2>;
};

const ReadMore = () => {
  // const albumImage = useAlbumImageContext();

  // ! will need to check for comments
  /*   if (!albumImage.description) {
    return null 
  } */

  return (
    <div className="max-h-[200px] overflow-y-auto">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at nunc
      iaculis, iaculis nisi id, finibus metus. Cras auctor convallis tincidunt.
      In fringilla fermentum condimentum. Proin eleifend, odio at blandit
      dictum, velit lectus ultrices justo, in scelerisque mauris elit quis
      dolor. Suspendisse ac neque nisi. Sed aliquet eget ipsum quis suscipit.
      Praesent imperdiet nunc ac nisi molestie tincidunt. Morbi consectetur
      accumsan erat eget tristique. In blandit vehicula mi, et placerat eros
      ullamcorper condimentum. Lorem ipsum dolor sit amet, consectetur
      adipiscing elit. Proin at nunc iaculis, iaculis nisi id, finibus metus.
      Cras auctor convallis tincidunt. In fringilla fermentum condimentum. Proin
      eleifend, odio at blandit dictum, velit lectus ultrices justo, in
      scelerisque mauris elit quis dolor. Suspendisse ac neque nisi. Sed aliquet
      eget ipsum quis suscipit. Praesent imperdiet nunc ac nisi molestie
      tincidunt. Morbi consectetur accumsan erat eget tristique. In blandit
      vehicula mi, et placerat eros ullamcorper condimentum.
    </div>
  );
};
