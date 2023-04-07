import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/Toast";
import { useAlbumContext } from "~/components/my-pages/album/_context";

// import { type OnSubmit } from "../CommentForm";

export const useCreateComment = () => {
  // export const useCreateComment = ({onSubmit}: { onSubmit: OnSubmit }) => {
  const album = useAlbumContext();

  const { refetch: refetchAlbum, isLoading } =
    api.album.albumPageGetOne.useQuery(
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

  return [createCommentMutation.mutate, { isLoading }];
};
