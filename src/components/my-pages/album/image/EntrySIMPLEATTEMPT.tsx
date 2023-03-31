import { useEffect, useRef, useState } from "react";
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
import { useAlbumImageContext } from "../_context";

// ! change cld image size on open image. Happens automatically?

const AlbumImage = () => {
  const albumImage = useAlbumImageContext();

  const [containerMeasurements, containerRef] = useMeasure<HTMLDivElement>();
  const containerIntersection = useIntersectionObserver(containerRef);

  return (
    <div ref={containerRef}>
      {containerMeasurements && containerIntersection ? (
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
          <OnContainerMeasurementsReady
            containerPos={{
              x: containerIntersection.boundingClientRect.x,
              y: containerIntersection.boundingClientRect.y,
            }}
            containerWidth={containerMeasurements.width}
            containerHeight={calcImgHeightForWidth({
              containerWidth: containerMeasurements.width,
              image: {
                naturalHeight: albumImage.image.naturalHeight,
                naturalWidth: albumImage.image.naturalWidth,
              },
            })}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AlbumImage;

const useImageInitialMeasurements = ({
  containerWidth,
  containerPos,
  containerHeight,
}: {
  containerWidth: number;
  containerHeight: number;
  containerPos: { x: number; y: number };
}) => {
  const dimensions = {
    width: containerWidth,
    height: containerHeight,
  };

  return {
    ...dimensions,
    ...containerPos,
  };
};

const useImageTransformMeasurements = ({
  initialMeasurements,
}: {
  initialMeasurements: ReturnType<typeof useImageInitialMeasurements>;
}) => {
  const windowSize = useWindowSize();

  const dimensions = calcDimensions({
    initialDimensions: {
      height: initialMeasurements.height,
      width: initialMeasurements.width,
    },
    transformTo: {
      maxDecimal: { height: 0.7, width: 0.8 },
      maxValue: { height: windowSize.height, width: windowSize.width },
    },
  });

  const position = calcTransformDistanceToWindowCenter({
    measurements: {
      ...dimensions,
      x: initialMeasurements.x,
      y: initialMeasurements.y,
    },
    windowSize,
  });

  return { ...dimensions, ...position };
};

const OnContainerMeasurementsReady = (props: {
  containerWidth: number;
  containerPos: { x: number; y: number };
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openState, setOpenState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");

  const initialMeasurements = useImageInitialMeasurements(props);

  const imageSpringInitialValues = {
    width: initialMeasurements.width,
    height: initialMeasurements.height,
    x: 0,
    y: 0,
  };

  const [imageSprings, imageApi] = useSpring(() => ({
    ...imageSpringInitialValues,
    config: { tension: 280, friction: 60 },
  }));

  const [bgSprings, bgApi] = useSpring(() => ({
    opacity: 0,
    config: { tension: 280, friction: 60 },
  }));

  const transormMeasurements = useImageTransformMeasurements({
    initialMeasurements,
  });

  useEffect(() => {
    if (openState === "open") {
      console.log("initialMeasurements:", initialMeasurements);
      console.log("transormMeasurements:", transormMeasurements);
      console.log("---------------------------------------------");
    }
  }, [openState]);

  function openImage() {
    setOpenState("opening");

    imageApi.start({
      ...transormMeasurements,
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
      ...imageSpringInitialValues,
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
      <div className="relative h-full border border-blue-700">
        <animated.div
          className={`absolute h-full w-full overflow-y-hidden bg-red-300 ${
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
        ></animated.div>
      </div>
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
