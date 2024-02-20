/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Fragment, useRef, useState, type ReactElement } from "react";
import { Transition } from "@headlessui/react";
// import CommentForm from "../CommentForm";
import DOMPurify from "dompurify";
import { signIn, useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/Toast";
import { SpinnerIcon } from "~/components/icon";
import { useAlbumContext, useAlbumImageContext } from "~/album/_context";
import { UserImage } from "~/containers";

// □ add mutation feedback

const CreateCommentSection = () => {
  return (
    <HandleUserStatus>
      <CreateCommentForm />
    </HandleUserStatus>
  );
};

export default CreateCommentSection;

const HandleUserStatus = ({
  children: commentForm,
}: {
  children: ReactElement;
}) => {
  const session = useSession();

  return (
    <div className="mt-4">
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

  const album = useAlbumContext();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    { enabled: false },
  );

  const createCommentMutation = api.albumImageComment.create.useMutation({
    async onSuccess() {
      await refetchAlbum();

      toast(<Toast text="Comment added" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Error adding comment" type="error" />);
    },
  });

  const session = useSession();

  return (
    <div className="flex gap-6">
      <UserImage src={session.data!.user.image} sideSize={40} />
      <CommentForm
        initialValue={undefined}
        isLoadingWriteMutation={createCommentMutation.isLoading}
        onSubmit={({ resetForm, value }) => {
          if (!value.length) {
            return;
          }
          createCommentMutation.mutate(
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
                resetForm();
              },
            },
          );
        }}
        placeholder="Add a comment..."
      />
    </div>
  );
};

export type OnSubmit = (arg0: { value: string; resetForm: () => void }) => void;

const CommentForm = ({
  initialValue = "",
  onSubmit,
  placeholder,
  isLoadingWriteMutation,
}: {
  initialValue: string | undefined;
  onSubmit: OnSubmit;
  placeholder: string;
  isLoadingWriteMutation: boolean;
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = () => {
    const clean = DOMPurify.sanitize(value);

    onSubmit({
      value: clean,
      resetForm: () => {
        setValue("");

        if (textAreaRef.current) {
          setIsFocused(false);
          textAreaRef.current.blur();
        }
      },
    });
  };

  return (
    <div className="relative w-full">
      <TextareaAutosize
        className={`w-full resize-none border-b bg-transparent pb-2 font-sans-3 text-sm  text-gray-900 transition-all duration-100 ease-in-out focus:border-b-gray-500`}
        maxRows={2}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
          }
        }}
        ref={textAreaRef}
      />
      {isFocused || value.length ? (
        <div className="mt-2 flex items-center justify-between">
          <button className="rounded-lg my-btn my-btn-neutral" type="button">
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

      <Transition
        as={Fragment}
        show={isLoadingWriteMutation}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center gap-2 bg-gray-50/70">
          <span>
            <SpinnerIcon />
          </span>
          <span className="text-xs text-gray-600">Sending...</span>
        </div>
      </Transition>
    </div>
  );
};
