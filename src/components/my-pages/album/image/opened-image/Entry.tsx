/* eslint-disable jsx-a11y/alt-text */

import { useState } from "react";

import { useAlbumImageContext } from "../../_context";
import Image from "./Image";
import Likes from "./Likes";
import CommentFormAndComments from "./comment-form-and-comments/Entry";

const OpenedImage = ({
  unopenedDimensions,
}: {
  unopenedDimensions: { width: number; height: number };
}) => {
  return (
    <div className="rounded-lg bg-gray-50/70 p-10  shadow-2xl">
      <Image unopenedDimensions={unopenedDimensions} />
      <ImageAboutAndComments />
    </div>
  );
};

export default OpenedImage;

const ImageAboutAndComments = () => {
  const [readMoreIsOpen, setReadMoreIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 pt-2">
      <TopBar
        readMoreIsOpen={readMoreIsOpen}
        toggleReadMoreIsOpen={() => setReadMoreIsOpen(!readMoreIsOpen)}
      />
      {readMoreIsOpen ? <ReadMore /> : null}
    </div>
  );
};

// ! waht to put for see more text
const TopBar = ({
  readMoreIsOpen,
  toggleReadMoreIsOpen,
}: {
  readMoreIsOpen: boolean;
  toggleReadMoreIsOpen: () => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Title />
        <div
          className="cursor-pointer text-sm text-gray-600"
          onClick={toggleReadMoreIsOpen}
        >
          read {readMoreIsOpen ? "less" : "more"}
        </div>
      </div>
      <Likes />
    </div>
  );
};

const Title = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.title?.length) {
    return null;
  }

  return <h3 className="font-medium">{albumImage.title}</h3>;
};

const ReadMore = () => {
  return (
    <div className="">
      <Description />
      <CommentFormAndComments />
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
