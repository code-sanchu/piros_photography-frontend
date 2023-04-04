/* eslint-disable jsx-a11y/alt-text */

import { useState } from "react";
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
    <div className="">
      <Image unopenedDimensions={unopenedDimensions} />
      <ImageAboutAndComments />
    </div>
  );
};

export default OpenedImage;

const ImageAboutAndComments = () => {
  const [readMoreIsOpen, setReadMoreIsOpen] = useState(false);
  const [commentsIsOpen, setCommentsIsOpen] = useState(false);
  // const [descriptionHeight, setDescriptionHeight] = useState(null)

  const [descriptionMeasurements, descriptionDummyRef] =
    useMeasure<HTMLDivElement>();

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const expand = () => {
    api.start({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      height: `${descriptionMeasurements!.height}px`,
      opacity: 1,
    });
    setReadMoreIsOpen(true);
  };

  const contract = () => {
    api.start({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      height: "0px",
      opacity: 0,
    });
    setReadMoreIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 pt-2">
      <TopBar
        readMoreIsOpen={readMoreIsOpen}
        toggleReadMoreIsOpen={readMoreIsOpen ? contract : expand}
        commentsIsOpen={commentsIsOpen}
        toggleCommentsIsOpen={() => setCommentsIsOpen(!commentsIsOpen)}
      />
      <div className="invisible fixed -z-10" ref={descriptionDummyRef}>
        <Description />
      </div>
      <animated.div style={{ overflowY: "hidden", ...springs }}>
        <Description />
      </animated.div>
      {/* {readMoreIsOpen ? <ReadMore /> : null} */}
    </div>
  );
};

const Description = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.description?.length) {
    return null;
  }

  return <p className="font-serif">{albumImage.description}</p>;
};

// ! waht to put for see more text
const TopBar = ({
  readMoreIsOpen,
  toggleReadMoreIsOpen,
  commentsIsOpen,
  toggleCommentsIsOpen,
}: {
  readMoreIsOpen: boolean;
  toggleReadMoreIsOpen: () => void;
  commentsIsOpen: boolean;
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
          <WithTooltip text="comments">
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

const ReadMore = () => {
  return (
    <div className="">
      {/* <Description /> */}
      <CommentFormAndComments />
    </div>
  );
};
