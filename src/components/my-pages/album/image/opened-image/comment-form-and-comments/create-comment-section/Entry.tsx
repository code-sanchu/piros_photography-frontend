import { type ReactElement } from "react";
import { signIn, useSession } from "next-auth/react";

import { useAlbumImageContext } from "~/album/_context";
import CommentForm from "../CommentForm";
import { useCreateComment } from "../_hooks";

const CreateCommentSection = () => {
  return (
    <HandleCommentFormForUserStatus>
      <CreateCommentForm />
    </HandleCommentFormForUserStatus>
  );
};

export default CreateCommentSection;

const HandleCommentFormForUserStatus = ({
  children: commentForm,
}: {
  children: ReactElement;
}) => {
  const session = useSession();

  return (
    <div className="mt-8">
      {session.status === "loading" ? (
        <p>Loading authentication status...</p>
      ) : session.status === "unauthenticated" ? (
        <p className="cursor-pointer text-sm text-gray-600">
          <span className="text-blue-600" onClick={() => void signIn()}>
            Sign in
          </span>{" "}
          to comment
        </p>
      ) : (
        commentForm
      )}
    </div>
  );
};

const CreateCommentForm = () => {
  const albumImage = useAlbumImageContext();

  const createComment = useCreateComment();

  const session = useSession();

  return (
    <CommentForm
      initialValue={undefined}
      onSubmit={({ resetValue, value }) => {
        if (!value.length) {
          return;
        }
        createComment(
          {
            data: {
              albumImageId: albumImage.id,
              text: value,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              userId: session.data!.user.id,
            },
          },
          {
            onSuccess() {
              resetValue();
            },
          },
        );
      }}
      placeholder="Add a comment..."
    />
  );
};
