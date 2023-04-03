import produce from "immer";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/Toast";
import {
  useAlbumContext,
  useAlbumImageComment,
  useAlbumImageContext,
} from "~/album/_context";

const useDeleteComment = () => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();
  const comment = useAlbumImageComment();

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

  return deleteMutation.mutate;
};

export default useDeleteComment;
