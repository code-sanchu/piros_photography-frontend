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

const Comments = () => {
  return (
    <div className="mt-4 border-t border-gray-400">
      <AddCommentForm />
      <UserComments />
    </div>
  );
};

export default Comments;

const AddCommentForm = () => {
  const session = useSession();

  return (
    <div className="mt-4">
      {session.status === "loading" ? (
        <p>Loading authentication status...</p>
      ) : session.status === "unauthenticated" ? (
        <p>Sign in to comment</p>
      ) : (
        <WriteComment />
      )}
    </div>
  );
};

const WriteComment = () => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`flex flex-col gap-6 ${
        value.length || isFocused ? "rounded-lg p-4 shadow-md" : ""
      }`}
    >
      {isFocused || value.length ? <User /> : null}
      <CommentForm
        setIsFocused={setIsFocused}
        isFocused={isFocused}
        setValue={setValue}
        value={value}
      />
    </div>
  );
};

const User = () => {
  const session = useSession();
  const sessionData = session.data as NonNullable<(typeof session)["data"]>;

  return (
    <div className="flex items-center gap-6">
      <div className="flex-shrink-0">
        <UserImage sideSize={30} />
      </div>
      <div>
        {sessionData.user.name ? <h3>{sessionData.user.name}</h3> : null}
      </div>
    </div>
  );
};

const UserImage = ({ sideSize }: { sideSize: number }) => {
  const session = useSession();

  return session.data?.user.image ? (
    <NextImage
      className="rounded-full"
      alt=""
      src={session.data.user.image}
      width={sideSize}
      height={sideSize}
    />
  ) : (
    <div className="rounded-full" style={{ width: sideSize, height: sideSize }}>
      <UserIcon />
    </div>
  );
};

const CommentForm = ({
  isFocused,
  setIsFocused,
  setValue,
  value,
}: {
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  value: string;
  setValue: (value: string) => void;
}) => {
  const albumImage = useAlbumImageContext();

  const createCommentMutation = api.albumImageComment.create.useMutation({
    onSuccess() {
      setValue("");
    },
  });

  const session = useSession();

  const handleSubmit = () => {
    if (!value.length) {
      return;
    }
    createCommentMutation.mutate({
      data: {
        albumImageId: albumImage.id,
        text: value,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: session.data!.user.id,
      },
    });
  };

  return (
    <div className={`${isFocused || value.length ? "" : ""}`}>
      <ReactTextareaAutosize
        className="w-full resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-800"
        maxRows={4}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onSubmit={handleSubmit}
        placeholder="Share your thoughts..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyPress={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      />
      {isFocused || value.length ? (
        <div className="mt-4 flex items-center justify-between">
          <button
            className="rounded-md border py-1 px-2 text-xs "
            onClick={() => {
              setValue("");
            }}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-md border bg-blue-500 py-1 px-2 text-xs text-white"
            onClick={handleSubmit}
            type="button"
          >
            Add Comment
          </button>
        </div>
      ) : null}
    </div>
  );
};

const UserComments = () => {
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
