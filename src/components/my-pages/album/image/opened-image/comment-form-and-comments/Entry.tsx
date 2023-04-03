import Comments from "./comments/Entry";
import CreateCommentSection from "./create-comment-section/Entry";

const CommentFormAndComments = () => {
  return (
    <div className="mt-8 border-t border-gray-200">
      <CreateCommentSection />
      <Comments />
    </div>
  );
};

export default CommentFormAndComments;
