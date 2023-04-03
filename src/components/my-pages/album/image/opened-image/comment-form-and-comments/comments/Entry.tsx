import {
  AlbumImageCommentProvider,
  useAlbumImageContext,
} from "~/album/_context";
import Comment from "./comment/Entry";

const Comments = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.comments.length) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-col gap-6 pt-4">
      {albumImage.comments.map((comment) => (
        <AlbumImageCommentProvider comment={comment} key={comment.id}>
          <Comment />
        </AlbumImageCommentProvider>
      ))}
    </div>
  );
};
export default Comments;
