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

  const transformedPosition = calcTransformDistanceToWindowCenter({
    transformElement: { x: left, y: top, ...transformedImageDimensions },
    windowSize,
  });
  // if (albumImage.index === 2) {
  console.log("transformedPosition:", albumImage.index, transformedPosition);
  // }

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      ...initialImageDimensions,
      x: 0,
      y: 0,
    },
  }));

  function openImage() {
    setOpenState("opening");
    api.start({
      ...transformedImageDimensions,
      ...transformedPosition,
      onResolve() {
        setOpenState("open");
      },
    });
  }

  function closeImage() {
    setOpenState("closing");
    api.start({
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
      {initialImageDimensions ? (
        <animated.div
          className="absolute flex h-full w-full cursor-pointer bg-yellow-100"
          style={{
            transformOrigin: "top",
            zIndex:
              isHovered ||
              openState === "opening" ||
              openState === "open" ||
              openState === "closing"
                ? 50
                : 0,
            ...springs,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
        </animated.div>
      ) : null}
    </>
  );
};
