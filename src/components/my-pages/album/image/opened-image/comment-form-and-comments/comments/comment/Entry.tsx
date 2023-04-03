import { Fragment, useRef, useState, type ReactElement } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useClickOutside } from "@react-hookz/web";
import produce from "immer";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/Toast";
import { DeleteIcon, EditIcon, UserMenuIcon } from "~/components/icon";
import { Modal } from "~/components/modal";
import {
  useAlbumContext,
  useAlbumImageComment,
  useAlbumImageContext,
} from "~/album/_context";
import { UserImage } from "~/containers";
import { timeAgo } from "~/helpers/time-ago";
import { useIsChange } from "~/hooks";
import useDeleteComment from "../../_hooks/useDeleteComment";

// □ would i be able to edit user comment without check in `UserCommentMenu`?
// □ admin abilities

const Comment = () => {
  const comment = useAlbumImageComment();

  return (
    <div className="group/comment flex gap-4">
      <UserImage src={comment.user.image} sideSize={30} />
      <RightSide />
    </div>
  );
};

const RightSide = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full">
      <TopBar isEditing={isEditing} setIsEditing={setIsEditing} />
      <CommentText isEditing={isEditing} setIsEditing={setIsEditing} />
    </div>
  );
};

const TopBar = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const comment = useAlbumImageComment();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-baseline gap-4">
        {comment.user.name ? (
          <p className="text-sm">{comment.user.name}</p>
        ) : null}
        <p className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</p>
      </div>
      <UserCommentMenu setIsEditing={setIsEditing} />
    </div>
  );
};

export default Comment;

const CommentText = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const comment = useAlbumImageComment();

  return (
    <div className="mt-2">
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
  const comment = useAlbumImageComment();

  const [value, setValue] = useState(comment.text);

  const { isChange, resetIsChange } = useIsChange({ value });

  const apiUtils = api.useContext();

  const updateTextMutation = api.albumImageComment.update.useMutation({
    async onMutate(mutationInput) {
      resetIsChange();

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
      <TextareaAutosize
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

const UserCommentMenu = ({
  setIsEditing,
}: {
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const session = useSession();
  const comment = useAlbumImageComment();

  if (!session.data) {
    return null;
  }

  if (session.data.user.id !== comment.user.id) {
    return null;
  }

  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="text-2xl text-gray-300 hover:!text-gray-700 group-hover/comment:text-gray-500">
          <UserMenuIcon weight="bold" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute right-0 z-50 flex origin-top-right flex-col gap-4 rounded-lg bg-white py-6 px-2 shadow-lg focus:outline-none`}
          >
            <Menu.Item>
              <div
                className="flex cursor-pointer items-center gap-5 rounded-md px-6 py-2 hover:bg-gray-200"
                onClick={() => setIsEditing(true)}
              >
                <span className="text-lg text-gray-700">
                  <EditIcon />
                </span>
                <p className="text-sm text-gray-700">Edit</p>
              </div>
            </Menu.Item>
            <Menu.Item>
              <UserDeleteCommentModal
                button={({ openModal }) => (
                  <div
                    className="flex cursor-pointer items-center gap-5 rounded-md px-6 py-2 hover:bg-gray-200"
                    onClick={openModal}
                  >
                    <span className="text-lg text-gray-700">
                      <DeleteIcon />
                    </span>
                    <p className="text-sm text-gray-700">Delete</p>
                  </div>
                )}
              />
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

const UserDeleteCommentModal = ({
  button,
}: {
  button: (arg0: { openModal: () => void }) => ReactElement;
}) => {
  const comment = useAlbumImageComment();

  const deleteComment = useDeleteComment();

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
                deleteComment(
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
