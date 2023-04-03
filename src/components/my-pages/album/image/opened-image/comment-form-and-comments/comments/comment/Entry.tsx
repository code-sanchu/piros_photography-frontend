import { useRef, useState, type ReactElement } from "react";
import { Menu } from "@headlessui/react";
import { useClickOutside } from "@react-hookz/web";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";

import MyMenu from "~/components/MyMenu";
import WithTooltip from "~/components/WithTooltip";
import {
  AdminIcon,
  DeleteIcon,
  EditIcon,
  UserMenuIcon,
} from "~/components/icon";
import { Modal } from "~/components/modal";
import { useAlbumImageComment } from "~/album/_context";
import { UserImage } from "~/containers";
import { timeAgo } from "~/helpers/time-ago";
import { useIsChange } from "~/hooks";
import useDeleteComment from "../../_hooks/useDeleteComment";
import useUpdateComment from "../../_hooks/useUpdateComment";

// □ would i be able to edit user comment without check in `UserCommentMenu`? Need supabase rls (row level security)?
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
      <TopBar setIsEditing={setIsEditing} />
      <CommentText isEditing={isEditing} setIsEditing={setIsEditing} />
    </div>
  );
};

const TopBar = ({
  // isEditing,
  setIsEditing,
}: {
  // isEditing: boolean;
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
      <div className="flex items-center gap-4">
        <UserCommentMenu setIsEditing={setIsEditing} />
        <AdminMenu />
      </div>
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

// ! form is unmounted when unfocused. If not unmounted, need to reset values below.

const UpdateCommentForm = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const comment = useAlbumImageComment();

  const [value, setValue] = useState(comment.text);

  const { isChange } = useIsChange({ value });

  const updateComment = useUpdateComment({
    onMutate() {
      setIsEditing(false);
    },
  });

  const handleSubmit = () => {
    if (!isChange || !value.length) {
      return;
    }

    const cleanInput = DOMPurify.sanitize(value);

    updateComment({
      data: { text: cleanInput },
      where: { commentId: comment.id },
    });
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(containerRef, () => {
    if (isEditing && !isChange) {
      setIsEditing(false);
    }
  });

  return (
    <div className="w-full" ref={containerRef}>
      <TextareaAutosize
        className={`w-full resize-none border-b bg-transparent pb-2 font-serif  text-gray-900 transition-all duration-100 ease-in-out focus-within:border-b-gray-500 `}
        maxRows={2}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder=""
        onFocus={(e) => {
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length,
          );
          setIsEditing(true);
        }}
        onKeyDown={(e) => {
          if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
          }
        }}
        autoFocus
      />
      {isEditing || isChange ? (
        <div className="mt-2 flex items-center justify-between">
          <button
            className="rounded-lg my-btn my-btn-neutral"
            onClick={() => {
              setIsEditing(false);
            }}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-blue-600 text-white my-btn hover:bg-blue-800"
            onClick={() => handleSubmit()}
            type="button"
          >
            Comment
          </button>
        </div>
      ) : null}
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
      <MyMenu
        button={
          <div className="text-2xl text-gray-300 hover:!text-gray-700 group-hover/comment:text-gray-500">
            <UserMenuIcon weight="bold" />
          </div>
        }
        items={
          <div className="flex flex-col gap-4 rounded-lg py-6 px-2">
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
          </div>
        }
        styles={{
          panel: "right-0 origin-top-right",
        }}
      />
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

const AdminMenu = () => {
  const session = useSession();

  if (session.data?.user.role !== "ADMIN") {
    return null;
  }
  return (
    <div className="relative">
      <MyMenu
        button={
          <WithTooltip text="admin menu">
            <div className="text-xl text-gray-300 hover:!text-gray-700 group-hover/comment:text-gray-500">
              <AdminIcon />
            </div>
          </WithTooltip>
        }
        items={
          <div className="flex flex-col gap-4 rounded-lg py-6 px-2">
            <Menu.Item>
              <AdminDeleteCommentModal
                button={({ openModal }) => (
                  <div
                    className="group/item flex cursor-pointer items-center gap-5 rounded-md px-6 py-2 hover:bg-gray-200"
                    onClick={openModal}
                  >
                    <span className="text-lg text-gray-700 transition-colors duration-75 ease-in-out group-hover/item:text-my-alert-content">
                      <DeleteIcon />
                    </span>
                    <p className="text-sm text-gray-700">Delete Comment</p>
                  </div>
                )}
              />
            </Menu.Item>
          </div>
        }
        styles={{
          panel: "right-0 origin-top-right",
        }}
      />
    </div>
  );
};

const AdminDeleteCommentModal = ({
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
        <div className="min-w-[350px] max-w-xl rounded-lg border bg-white p-4 shadow-lg">
          <h4>Delete comment</h4>
          <p className="mt-4 text-sm text-gray-400">
            Use admin privileges to delete comment?
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
