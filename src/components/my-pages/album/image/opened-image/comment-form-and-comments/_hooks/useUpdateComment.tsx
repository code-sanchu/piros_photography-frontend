import produce from "immer";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Toast from "~/components/Toast";
import {
  useAlbumContext,
  useAlbumImageComment,
  useAlbumImageContext,
} from "~/album/_context";

// const useUpdateComment = () => {
const useUpdateComment = ({ onMutate }: { onMutate: () => void }) => {
  const album = useAlbumContext();
  const albumImage = useAlbumImageContext();
  const comment = useAlbumImageComment();

  const apiUtils = api.useContext();

  const updateTextMutation = api.albumImageComment.update.useMutation({
    async onMutate(mutationInput) {
      onMutate();

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

  return updateTextMutation.mutate;
};

export default useUpdateComment;
