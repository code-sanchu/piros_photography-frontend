import { useState } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import ReactTextareaAutosize from "react-textarea-autosize";

import { api } from "~/utils/api";
import { UserIcon } from "~/components/icon";
import { useAlbumImageContext } from "../../_context";

// ! textareaautosize does have an onHeightChange callback

const Comments = () => {
  return (
    <div className="mt-2">
      {/* <h4 className="text-gray-500">Comments</h4> */}
      <AddCommentForm />
    </div>
  );
};

export default Comments;

const AddCommentForm = () => {
  const session = useSession();

  return (
    <div className="mt-2">
      {session.status === "loading" ? (
        <p>Loading authentication status...</p>
      ) : session.status === "unauthenticated" ? (
        <p>Sign in to comment</p>
      ) : (
        <WriteComment />
      )}
      <UserComments />
    </div>
  );
};

const WriteComment = () => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`${value.length || isFocused ? "" : ""}`}>
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
      alt=""
      src={session.data.user.image}
      width={sideSize}
      height={sideSize}
    />
  ) : (
    <div style={{ width: sideSize, height: sideSize }}>
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
    <div className={`${isFocused || value.length ? "mt-4 " : ""}`}>
      <ReactTextareaAutosize
        className="w-full resize-none text-sm text-gray-800 "
        maxRows={4}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onSubmit={handleSubmit}
        placeholder="What are your thoughts?"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyPress={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      />
      {isFocused || value.length ? (
        <div className="mt-1 flex items-center justify-between">
          <button
            className="rounded-md border py-1 px-2 text-xs "
            onClick={() => {
              //  need to unfocus
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
    <div className="mt-1 text-sm">
      {albumImage.comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};
