import { useRef, useState, type ReactElement } from "react";
import NextImage from "next/image";
import { useClickOutside } from "@react-hookz/web";
import produce from "immer";
import { useSession } from "next-auth/react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/Toast";
import { UserIcon } from "~/components/icon";
import { Modal } from "~/components/modal";
import {
  AlbumImageCommentProvider,
  useAlbumContext,
  useAlbumImageCommentState,
  useAlbumImageContext,
} from "~/album/_context";
import { timeAgo } from "~/helpers/time-ago";
import { useIsChange } from "~/hooks";
import CommentForm from "./CommentForm";
import { useCreateComment } from "./_hooks";

const CommentFormAndComments = () => {
  return (
    <div className="mt-8 border-t border-gray-200">
      <HandleCommentFormForUserStatus>
        <CreateCommentForm />
      </HandleCommentFormForUserStatus>
      <Comments />
    </div>
  );
};

export default CommentFormAndComments;

// ! sign in link below

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
        <p>Sign in to comment</p>
      ) : (
        commentForm
      )}
    </div>
  );
};

const CreateCommentForm = () => {
  const albumImage = useAlbumImageContext();

  // const createCommentMutation = api.albumImageComment.create.useMutation();
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

const Comments = () => {
  const albumImage = useAlbumImageContext();

  if (!albumImage.comments.length) {
    return null;
  }

  return (
    <div className="mt-2 pt-4  text-sm">
      {albumImage.comments.map((comment) => (
        <AlbumImageCommentProvider comment={comment} key={comment.id}>
          <UserComment />
        </AlbumImageCommentProvider>
      ))}
    </div>
  );
};

const UserComment = () => {
  const [isEditing, setIsEditing] = useState(false);
  const comment = useAlbumImageCommentState();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CommentUserImage imageSrc={comment.user.image} />
          <div className="flex items-center gap-4 text-sm">
            {comment.user.name ? <p>{comment.user.name}</p> : null}
            <p className="text-gray-400">{timeAgo(comment.createdAt)}</p>
          </div>
        </div>
        <UserCommentMenu isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
      <UserCommentText isEditing={isEditing} setIsEditing={setIsEditing} />
    </div>
  );
};

const UserCommentText = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const comment = useAlbumImageCommentState();

  return (
    <div>
      {isEditing ? (
        <UpdateCommentForm isEditing={isEditing} setIsEditing={setIsEditing} />
      ) : (
        <p className="font-serif text-base">{comment.text}</p>
      )}
    </div>
  );
};

const UpdateCommentForm = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  // const session = useSession();
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();
  const comment = useAlbumImageCommentState();

  const [value, setValue] = useState(comment.text);

  const { isChange, resetIsChange } = useIsChange({ value });

  const apiUtils = api.useContext();

  const updateTextMutation = api.albumImageComment.update.useMutation({
    async onMutate(mutationInput) {
      const prevData = apiUtils.album.albumPageGetOne.getData();

      await apiUtils.album.albumPageGetOne.cancel();

      apiUtils.album.albumPageGetOne.setData(
        { albumId: album.id },
        (currData) => {
          if (!currData) {
            return prevData;
          }

          const updatedData = produce(currData, (draft) => {
            const imageIndex = draft.images.findIndex(
              (draftImage) => draftImage.id === albumImage.id,
            );
            const draftImage = draft.images[imageIndex];

            if (!draftImage) {
              return;
            }

            const commentIndex = draftImage.comments.findIndex(
              (draftComment) => draftComment.id === comment.id,
            );
            const draftComment = draftImage.comments[commentIndex];

            if (!draftComment) {
              return;
            }

            draftComment.text = mutationInput.data.text;
          });

          return updatedData;
        },
      );
    },
    onSuccess() {
      toast(<Toast text="Comment updated" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Error updating comment" type="error" />);
    },
  });

  const ref = useRef<HTMLTextAreaElement | null>(null);

  useClickOutside(ref, () => {
    if (isEditing) {
      setIsEditing(false);
    }
  });

  const handleSubmit = () => {
    if (!isChange) {
      return;
    }

    updateTextMutation.mutate({
      data: { text: value },
      where: { commentId: comment.id },
    });
  };

  return (
    <div className="relative">
      <ReactTextareaAutosize
        className="w-full resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-800"
        maxRows={4}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onSubmit={() => {
          handleSubmit();
        }}
        placeholder="Update comment..."
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();

            handleSubmit();
          }
        }}
        autoFocus
        ref={ref}
      />
    </div>
  );
};

// ! user needs to be able to delete, and update
// ! would i be able to edit user comment without check in `UserCommentMenu`?
// ! admin abilities

const UserCommentMenu = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const session = useSession();
  const comment = useAlbumImageCommentState();

  if (!session.data) {
    return null;
  }

  if (session.data.user.id !== comment.user.id) {
    return null;
  }

  return (
    <>
      <UserCommentMenuSmallScreen />
      <UserCommentMenuNonSmallScreen
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </>
  );
};

const UserCommentMenuSmallScreen = () => {
  return <div className="sm:hidden"></div>;
};

const UserCommentMenuNonSmallScreen = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  return (
    <div className=" hidden items-center justify-between gap-4 sm:flex">
      <div
        className="cursor-pointer text-xs text-gray-400 transition-colors duration-75 ease-in-out hover:text-gray-600"
        onClick={() => setIsEditing(true)}
      >
        edit
      </div>
      <UserDeleteCommentModal
        button={({ openModal }) => (
          <div
            className="cursor-pointer text-xs text-red-400 transition-colors duration-75 ease-in-out hover:text-red-600"
            onClick={openModal}
          >
            delete
          </div>
        )}
      />
    </div>
  );
};

const UserDeleteCommentModal = ({
  button,
}: {
  button: (arg0: { openModal: () => void }) => ReactElement;
}) => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();
  const comment = useAlbumImageCommentState();

  const apiUtils = api.useContext();

  const deleteMutation = api.albumImageComment.delete.useMutation({
    async onMutate() {
      const prevData = apiUtils.album.albumPageGetOne.getData();

      await apiUtils.album.albumPageGetOne.cancel();

      apiUtils.album.albumPageGetOne.setData(
        { albumId: album.id },
        (currData) => {
          if (!currData) {
            return prevData;
          }

          const updatedData = produce(currData, (draft) => {
            const imageIndex = draft.images.findIndex(
              (draftImage) => draftImage.id === albumImage.id,
            );
            const draftImage = draft.images[imageIndex];

            if (!draftImage) {
              return;
            }

            const commentIndex = draftImage.comments.findIndex(
              (draftComment) => draftComment.id === comment.id,
            );

            if (commentIndex === -1) {
              return;
            }

            draftImage.comments.splice(commentIndex, 1);
          });

          return updatedData;
        },
      );
    },
    onSuccess() {
      toast(<Toast text="Comment deleted" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Error deleting comment" type="error" />);
    },
  });

  return (
    <Modal
      button={button}
      panelContent={({ closeModal }) => (
        <div className="min-w-[300px] max-w-xl rounded-lg border bg-white p-4 shadow-lg">
          <h4>Delete comment</h4>
          <p className="mt-4 text-sm text-gray-400">
            Delete your comment permanently?
          </p>
          <div className="mt-8 flex  items-center justify-between">
            <button
              className="my-btn my-btn-neutral"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="my-btn my-btn-action"
              onClick={() => {
                deleteMutation.mutate(
                  { where: { commentId: comment.id } },
                  {
                    onSuccess() {
                      closeModal();
                    },
                  },
                );
              }}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    />
  );
};

const CommentUserImage = ({
  imageSrc,
}: {
  imageSrc: string | undefined | null;
}) => {
  return imageSrc ? (
    <NextImage
      className="rounded-full"
      alt=""
      src={imageSrc}
      width={25}
      height={25}
    />
  ) : (
    <div className="rounded-full" style={{ width: 25, height: 25 }}>
      <UserIcon />
    </div>
  );
};
