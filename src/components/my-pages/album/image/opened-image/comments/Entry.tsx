import { useState } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import ReactTextareaAutosize from "react-textarea-autosize";

import { api } from "~/utils/api";
import { UserIcon } from "~/components/icon";
import { timeAgo } from "~/helpers/time-ago";
import { useAlbumImageContext } from "../../../_context";
import { type AlbumImage } from "../../../_types";

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
        <UserComment comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

// ! user needs to be able to delete, and update

const UserComment = ({ comment }: { comment: AlbumImage["comments"][0] }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <CommentUserImage imageSrc={comment.user.image} />
        <div className="flex items-center gap-4 text-sm">
          {comment.user.name ? <p>{comment.user.name}</p> : null}
          <p className="text-gray-400">{timeAgo(comment.createdAt)}</p>
        </div>
      </div>
      <div>
        <p className="font-serif text-base">{comment.text}</p>
      </div>
    </div>
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
