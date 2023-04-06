/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/alt-text */

import { useEffect, useState, type ReactElement } from "react";
import { useMeasure, useWindowSize } from "@react-hookz/web";
import { animated, useSpring } from "@react-spring/web";

import WithTooltip from "~/components/WithTooltip";
import {
  CaretDownIcon,
  CaretUpIcon,
  ImageCommentIcon,
} from "~/components/icon";
import { calcDimensions } from "~/helpers/transformation";
import { useAlbumImageContext } from "../../_context";
import Image from "./Image";
import LikesIconAndCount from "./Likes";
import CommentFormAndComments from "./comment-form-and-comments/Entry";

const OpenedImage = ({
  unopenedDimensions,
}: {
  unopenedDimensions: { width: number; height: number };
}) => {
  return (
    <div className="relative grid h-[100vh] w-screen place-items-center overflow-y-auto py-10 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center">
          <Image unopenedDimensions={unopenedDimensions} />
        </div>
        <div className="flex justify-center">
          <DescriptionAndUserInteractivity />
        </div>
      </div>
    </div>
  );
};

export default OpenedImage;

const DescriptionAndUserInteractivity = () => {
  const albumImage = useAlbumImageContext();

  const description = useDescriptionVisibility();

  const comments = useCommentsVisibility();

  const windowSize = useWindowSize();

  const imageWidthOpenedMaxDecimal =
    windowSize.width > 850 ? 0.9 : windowSize.width > 600 ? 0.85 : 0.8;

  const openedDimensions = calcDimensions({
    initialDimensions: {
      height: albumImage.image.naturalHeight,
      width: albumImage.image.naturalWidth,
    },
    transformTo: {
      maxValue: {
        height: windowSize.height,
        width: windowSize.width,
      },
      maxDecimal: {
        width: imageWidthOpenedMaxDecimal,
        height: 0.8,
      },
    },
  });

  const [containerMeasurements, containerRef] = useMeasure<HTMLDivElement>();

  return (
    <>
      <div
        className="flex w-full min-w-[80vw] justify-center md:min-w-[720px]"
        style={{ maxWidth: openedDimensions.width }}
      >
        <div className="relative w-full" ref={containerRef}>
          <div className="mt-3 flex flex-col gap-2 sm:mt-4">
            <TopBar
              commentsIconAndCount={
                <CommentsIconAndCount
                  isOpen={comments.isOpen}
                  toggleIsOpen={
                    comments.isOpen ? comments.close : comments.open
                  }
                />
              }
              descriptionButton={
                <DescriptionButton isOpen={description.isOpen} />
              }
              toggleDescriptionVisibility={
                description.isOpen ? description.close : description.open
              }
            />
            <animated.div
              style={{ overflowY: "hidden", ...description.springs }}
            >
              <DescriptionText />
            </animated.div>
            <animated.div style={{ overflowY: "hidden", ...comments.springs }}>
              <CommentFormAndComments closeComments={comments.close} />
            </animated.div>
          </div>
        </div>
      </div>
      {containerMeasurements ? (
        <>
          <div
            className="invisible fixed left-0 top-0 -z-10 w-full"
            style={{ width: containerMeasurements.width }}
            ref={description.dummyRef}
          >
            <DescriptionText />
          </div>
          <div
            className="invisible fixed left-0 top-0 -z-10 w-full"
            style={{ width: containerMeasurements.width }}
            ref={comments.dummyRef}
          >
            <CommentFormAndComments closeComments={comments.close} />
          </div>
        </>
      ) : null}
    </>
  );
};

const useDescriptionVisibility = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [measurements, dummyRef] = useMeasure<HTMLDivElement>();

  const [springs, springsApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const open = () => {
    if (!measurements) {
      return;
    }

    springsApi.start({
      height: `${measurements.height}px`,
      opacity: 1,
    });

    setIsOpen(true);
  };

  const close = () => {
    springsApi.start({
      height: "0px",
      opacity: 0,
    });
    setIsOpen(false);
  };

  return {
    dummyRef,
    springs,
    open,
    close,
    isOpen,
  };
};

const useCommentsVisibility = () => {
  const [isOpen, setCommentsIsOpen] = useState(false);

  const [dummyMeasurements, dummyRef] = useMeasure<HTMLDivElement>();

  const [springs, springApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const open = () => {
    springApi.start({
      height: `${dummyMeasurements!.height}px`,
      opacity: 1,
    });
    setCommentsIsOpen(true);
  };

  const close = () => {
    springApi.start({
      height: "0px",
      opacity: 0,
    });
    setCommentsIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen || !dummyMeasurements) {
      return;
    }

    springApi.start({
      height: `${dummyMeasurements.height}px`,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dummyMeasurements?.height]);

  return {
    dummyRef,
    springs,
    open,
    close,
    isOpen,
  };
};

const TopBar = ({
  descriptionButton,
  commentsIconAndCount,
  toggleDescriptionVisibility,
}: {
  toggleDescriptionVisibility: () => void;
  descriptionButton: ReactElement | null;
  commentsIconAndCount: ReactElement;
}) => {
  return (
    <div className="flex items-center justify-between gap-6">
      <div
        className="flex items-center gap-2 sm:gap-4 md:gap-8"
        onClick={toggleDescriptionVisibility}
      >
        <Title />
        {descriptionButton}
      </div>
      <div className="flex items-center gap-6 sm:gap-10">
        {commentsIconAndCount}
        <LikesIconAndCount />
      </div>
    </div>
  );
};

const Title = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.title?.length) {
    return null;
  }

  return (
    <h3 className="font-sans-secondary text-base font-light tracking-wide">
      {albumImage.title}
    </h3>
  );
};

const DescriptionButton = ({ isOpen }: { isOpen: boolean }) => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.description?.length) {
    return null;
  }

  return (
    <WithTooltip text="description">
      <div className="flex cursor-pointer items-center gap-2">
        {!isOpen ? (
          <span className="text-xs text-gray-400">
            <CaretDownIcon weight="light" />
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            <CaretUpIcon weight="light" />
          </span>
        )}
      </div>
    </WithTooltip>
  );
};

const DescriptionText = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.description?.length) {
    return null;
  }

  return <p className="font-serif-3 text-lg">{albumImage.description}</p>;
};

const CommentsIconAndCount = ({
  isOpen,
  toggleIsOpen,
}: {
  isOpen: boolean;
  toggleIsOpen: () => void;
}) => {
  return (
    <div className="flex items-center gap-3" onClick={toggleIsOpen}>
      <WithTooltip text={!isOpen ? "comments" : "close comments"}>
        <span className={`cursor-pointer text-xl text-gray-800`}>
          <ImageCommentIcon weight="thin" />
        </span>
      </WithTooltip>
      <CommentsCount />
    </div>
  );
};

const CommentsCount = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.comments.length) {
    return null;
  }

  return (
    <p className="font-sans-secondary text-sm font-thin tracking-wide text-gray-900">
      {albumImage.comments.length}
    </p>
  );
};
