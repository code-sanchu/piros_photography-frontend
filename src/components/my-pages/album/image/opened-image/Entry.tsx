/* eslint-disable jsx-a11y/alt-text */

import { useEffect, useState } from "react";
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
import Likes from "./Likes";
import CommentFormAndComments from "./comment-form-and-comments/Entry";

// ! td: prev/next img; lazy load read more content
// ! td: could have 'respond' button to show comments

const OpenedImage = ({
  unopenedDimensions,
}: {
  unopenedDimensions: { width: number; height: number };
}) => {
  return (
    <div className="flex max-h-[90vh] flex-col gap-2">
      <Image unopenedDimensions={unopenedDimensions} />
      <ImageAboutAndComments />
    </div>
  );
};

export default OpenedImage;

const ImageAboutAndComments = () => {
  const [readMoreIsOpen, setReadMoreIsOpen] = useState(false);
  const [commentsIsOpen, setCommentsIsOpen] = useState(false);

  const albumImage = useAlbumImageContext();
  const windowSize = useWindowSize();
  // image size
  const imageDimensions = calcDimensions({
    initialDimensions: {
      height: albumImage.image.naturalHeight,
      width: albumImage.image.naturalWidth,
    },
    transformTo: {
      maxValue: {
        height: windowSize.height,
        width: windowSize.width,
      },
      maxDecimal: { width: 0.8, height: 0.7 },
    },
  });

  const [descriptionMeasurements, descriptionDummyRef] =
    useMeasure<HTMLDivElement>();

  const [descriptionSprings, descriptionSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const expandDescription = () => {
    descriptionSpringApi.start({
      height: `${
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        descriptionMeasurements!.height
      }px`,
      opacity: 1,
    });
    setReadMoreIsOpen(true);
  };

  const contractDescription = () => {
    descriptionSpringApi.start({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      height: "0px",
      opacity: 0,
    });
    setReadMoreIsOpen(false);
  };

  const [commentsMeasurements, commentsDummyRef] = useMeasure<HTMLDivElement>();

  const [commentsSprings, commentsSpringApi] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const expandComments = () => {
    commentsSpringApi.start({
      height: `${
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        commentsMeasurements!.height
      }px`,
      opacity: 1,
    });
    setCommentsIsOpen(true);
  };

  const contractComments = () => {
    commentsSpringApi.start({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  const maxTotalWindowHeight = windowSize.height * 0.9;
  const maxHeight = maxTotalWindowHeight - imageDimensions.height;

  return (
    <div className="flex flex-col gap-2">
      <TopBar
        commentsIsOpen={commentsIsOpen}
        readMoreIsOpen={readMoreIsOpen}
        toggleReadMoreIsOpen={
          readMoreIsOpen ? contractDescription : expandDescription
        }
        toggleCommentsIsOpen={
          commentsIsOpen ? contractComments : expandComments
        }
      />
      <div className={"overflow-y-auto"} style={{ maxHeight }}>
        <div className="invisible fixed -z-10" ref={descriptionDummyRef}>
          <Description />
        </div>
        <animated.div style={{ overflowY: "hidden", ...descriptionSprings }}>
          <Description />
        </animated.div>
        <div className="invisible fixed -z-10" ref={commentsDummyRef}>
          <Comments />
        </div>
        <animated.div style={{ overflowY: "hidden", ...commentsSprings }}>
          <Comments />
        </animated.div>
      </div>
    </div>
  );
};

const Description = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.description?.length) {
    return null;
  }

  return (
    <div>
      {/* <div className="border border-blue-600"> */}
      <p className="font-serif text-gray-800">{albumImage.description}</p>
      {/* <Comments /> */}
    </div>
  );
};

// ! waht to put for see more text
const TopBar = ({
  commentsIsOpen,
  readMoreIsOpen,
  toggleReadMoreIsOpen,
  toggleCommentsIsOpen,
}: {
  commentsIsOpen: boolean;
  readMoreIsOpen: boolean;
  toggleReadMoreIsOpen: () => void;
  toggleCommentsIsOpen: () => void;
}) => {
  const albumImage = useAlbumImageContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Title />
        {albumImage.description?.length ? (
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={toggleReadMoreIsOpen}
          >
            <span className="font-sans text-sm tracking-wide text-gray-400">
              about
            </span>
            {!readMoreIsOpen ? (
              <span className="text-xs text-gray-400">
                <CaretDownIcon />
              </span>
            ) : (
              <span className="text-xs text-gray-400">
                <CaretUpIcon />
              </span>
            )}
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <WithTooltip text={!commentsIsOpen ? "comments" : "hide comments"}>
            <span
              className={`cursor-pointer text-2xl text-gray-500`}
              onClick={toggleCommentsIsOpen}
            >
              <ImageCommentIcon weight="thin" />
            </span>
          </WithTooltip>
          <CommentsCount />
        </div>
        <Likes />
      </div>
    </div>
  );
};

const CommentsCount = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.comments.length) {
    return null;
  }

  return (
    <p className="text-sm font-thin text-gray-900">
      {albumImage.comments.length}
    </p>
  );
};

const Title = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.title?.length) {
    return null;
  }

  return <h3 className="font-serif">{albumImage.title}</h3>;
};

const Comments = () => {
  return <CommentFormAndComments />;
};
