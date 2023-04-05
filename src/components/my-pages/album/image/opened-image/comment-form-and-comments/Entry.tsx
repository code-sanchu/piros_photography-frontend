import Comments from "./comments/Entry";
import CreateCommentSection from "./create-comment-section/Entry";

const CommentFormAndComments = ({
  closeComments,
}: {
  closeComments: () => void;
}) => {
  return (
    <div className="mt-8 border-t border-gray-200 pb-12">
      <div className="mt-1 flex justify-end">
        <button
          className="p-1 text-sm text-gray-400"
          onClick={closeComments}
          type="button"
        >
          Close comments
        </button>
      </div>
      <CreateCommentSection />
      <Comments />
    </div>
  );
};

export default CommentFormAndComments;
