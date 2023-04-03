import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/Toast";
import WithTooltip from "~/components/WithTooltip";
import { LikeIcon } from "~/components/icon";
import { useAlbumContext, useAlbumImageContext } from "../../_context";

const Likes = () => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();

  const session = useSession();

  const { refetch: refetchAlbum } = api.album.albumPageGetOne.useQuery(
    { albumId: album.id },
    { enabled: false },
  );

  const likeImageMutation = api.albumImageLike.create.useMutation({
    async onSuccess() {
      await refetchAlbum();

      toast(<Toast text="Added like" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Error adding like" type="error" />);
    },
  });

  const unlikeImageMutation = api.albumImageLike.delete.useMutation({
    async onSuccess() {
      await refetchAlbum();

      toast(<Toast text="Removed like" type="success" />);
    },
    onError: () => {
      toast(<Toast text="Error removing like" type="error" />);
    },
  });

  const imgIsLikedByUser = !session.data
    ? null
    : albumImage.likes
        .flatMap((like) => like.userId)
        .includes(session.data.user.id);

  const handleToggleLike = () => {
    if (!session.data?.user) {
      return;
    }

    if (!imgIsLikedByUser) {
      likeImageMutation.mutate({
        data: { albumImageId: albumImage.id, userId: session.data.user.id },
      });
    } else {
      const like = albumImage.likes.find(
        (like) => like.userId === session.data.user.id,
      );
      if (!like) {
        return;
      }
      unlikeImageMutation.mutate({
        where: { likeId: like.id },
      });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <WithTooltip
          text={!imgIsLikedByUser ? "clap" : "unclap"}
          isDisabled={!session.data}
        >
          <span
            className={`cursor-pointer text-2xl text-gray-500`}
            onClick={handleToggleLike}
          >
            <LikeIcon weight={imgIsLikedByUser ? "fill" : "regular"} />
          </span>
        </WithTooltip>
        {albumImage.likes.length ? (
          <span className="text-sm text-gray-500">
            {albumImage.likes.length}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default Likes;
