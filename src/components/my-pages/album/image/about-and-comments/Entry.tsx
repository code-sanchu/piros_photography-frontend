import { useAlbumImageContext } from "../../_context";
import Comments from "./Comments";

const AboutImageAndComments = ({
  handleShowReadMore,
  readMoreIsShowing,
}: {
  handleShowReadMore: () => void;
  readMoreIsShowing: boolean;
}) => {
  return (
    <div>
      <TopBar
        handleShowReadMore={handleShowReadMore}
        readMoreIsShowing={readMoreIsShowing}
      />
      <div>
        <ReadMore />
      </div>
    </div>
  );
};

export default AboutImageAndComments;

export const TopBar = ({
  handleShowReadMore,
  readMoreIsShowing,
}: {
  handleShowReadMore?: () => void;
  readMoreIsShowing?: boolean;
}) => {
  const albumImage = useAlbumImageContext();

  return (
    <div className="flex  gap-md pt-2">
      <h2>{albumImage.title || "Image title"}</h2>
      <button className="text-xs text-gray-500" onClick={handleShowReadMore}>
        read {readMoreIsShowing ? "less" : "more"}
      </button>
    </div>
  );
};

export const ReadMore = () => {
  const albumImage = useAlbumImageContext();

  return (
    <div className="h-[400px] overflow-y-auto border-b border-black">
      {albumImage.description ? <p>{albumImage.description}</p> : null}
      <Comments />
    </div>
  );
};
