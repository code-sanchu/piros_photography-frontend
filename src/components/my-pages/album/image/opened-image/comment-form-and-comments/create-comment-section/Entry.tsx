/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, useState, type ReactElement } from "react";
// import CommentForm from "../CommentForm";
import DOMPurify from "dompurify";
import { signIn, useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";

import { useAlbumImageContext } from "~/album/_context";
import { UserImage } from "~/containers";
import { useCreateComment } from "../_hooks";

// □ add mutation feedback

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

  const createComment = useCreateComment();

  const session = useSession();

  return (
    <CommentForm
      initialValue={undefined}
      onSubmit={({ resetForm, value }) => {
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
              resetForm();
            },
          },
        );
      }}
      placeholder="Add a comment..."
    />
  );
};

export type OnSubmit = (arg0: { value: string; resetForm: () => void }) => void;

const CommentForm = ({
  initialValue = "",
  onSubmit,
  placeholder,
}: {
  initialValue: string | undefined;
  onSubmit: OnSubmit;
  placeholder: string;
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const session = useSession();

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
    <div className="flex gap-6">
      <UserImage src={session.data!.user.image} sideSize={40} />
      <div className="w-full">
        <TextareaAutosize
          className={`w-full resize-none border-b bg-transparent pb-2 font-serif  text-gray-900 transition-all duration-100 ease-in-out focus:border-b-gray-500`}
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
      </div>
    </div>
  );
};
