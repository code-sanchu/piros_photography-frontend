/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/alt-text */

import { useEffect, useState, type ReactElement } from "react";
import { useMeasure } from "@react-hookz/web";
import { animated, useSpring } from "@react-spring/web";

import WithTooltip from "~/components/WithTooltip";
import {
  CaretDownIcon,
  CaretUpIcon,
  ImageCommentIcon,
} from "~/components/icon";
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
    <div className="relative grid h-[100vh] w-screen place-items-center overflow-y-auto pt-16 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
      <div className="flex flex-col gap-2">
        <Image unopenedDimensions={unopenedDimensions} />
        <DescriptionAndUserInteractivity />
      </div>
    </div>
  );
};

export default OpenedImage;

const DescriptionAndUserInteractivity = () => {
  const [descriptionIsOpen, setDescriptionIsOpen] = useState(false);
  const [commentsIsOpen, setCommentsIsOpen] = useState(false);

  const [descriptionMeasurements, descriptionDummyRef] =
    useMeasure<HTMLDivElement>();

  const [descriptionSprings, descriptionSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const openDescription = () => {
    descriptionSpringApi.start({
      height: `${descriptionMeasurements!.height}px`,
      opacity: 1,
    });
    setDescriptionIsOpen(true);
  };

  const closeDescription = () => {
    descriptionSpringApi.start({
      height: "0px",
      opacity: 0,
    });
    setDescriptionIsOpen(false);
  };

  // COMMENTS
  const [commentsMeasurements, commentsDummyRef] = useMeasure<HTMLDivElement>();

  const [commentsSprings, commentsSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const openComments = () => {
    commentsSpringApi.start({
      height: `${commentsMeasurements!.height}px`,
      opacity: 1,
    });
    setCommentsIsOpen(true);
  };

  const closeComments = () => {
    commentsSpringApi.start({
      height: "0px",
      opacity: 0,
    });
    setCommentsIsOpen(false);
  };

  useEffect(() => {
    if (!commentsIsOpen || !commentsMeasurements) {
      return;
    }

    commentsSpringApi.start({
      height: `${commentsMeasurements.height}px`,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsMeasurements?.height]);

  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <TopBar
          commentsIconAndCount={
            <CommentsIconAndCount
              isOpen={commentsIsOpen}
              toggleIsOpen={commentsIsOpen ? closeComments : openComments}
            />
          }
          descriptionButton={
            <DescriptionButton
              isOpen={descriptionIsOpen}
              toggleIsOpen={
                descriptionIsOpen ? closeDescription : openDescription
              }
            />
          }
        />
        <animated.div style={{ overflowY: "hidden", ...descriptionSprings }}>
          <DescriptionText />
        </animated.div>
        <animated.div style={{ overflowY: "hidden", ...commentsSprings }}>
          <CommentFormAndComments closeComments={closeComments} />
        </animated.div>
      </div>
      <div className="invisible fixed -z-10" ref={descriptionDummyRef}>
        <DescriptionText />
      </div>
      <div className="invisible fixed -z-10" ref={commentsDummyRef}>
        <CommentFormAndComments closeComments={closeComments} />
      </div>
    </>
  );
};

const TopBar = ({
  descriptionButton,
  commentsIconAndCount,
}: {
  descriptionButton: ReactElement | null;
  commentsIconAndCount: ReactElement;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Title />
        {descriptionButton}
      </div>
      <div className="flex items-center gap-10">
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

const DescriptionButton = ({
  isOpen,
  toggleIsOpen,
}: {
  isOpen: boolean;
  toggleIsOpen: () => void;
}) => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.description?.length) {
    return null;
  }

  return (
    <WithTooltip text="description">
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={toggleIsOpen}
      >
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
