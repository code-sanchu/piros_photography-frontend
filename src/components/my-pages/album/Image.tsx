import { useMeasure } from "@react-hookz/web";

import MyCldImage from "~/components/image/MyCldImage";
import { calcImgHeightForWidth } from "~/helpers/transformation";
import { useAlbumImageContext } from "./_context";

const Image = ({ loading }: { loading: "eager" | "lazy" }) => {
  const albumImage = useAlbumImageContext();

  const [containerMeasurements, containerRef] = useMeasure<HTMLDivElement>();

  return (
    <div ref={containerRef}>
      {containerMeasurements
        ? [0].map((_, i) => {
            const height = calcImgHeightForWidth({
              containerWidth: containerMeasurements.width,
              image: {
                naturalHeight: albumImage.image.naturalHeight,
                naturalWidth: albumImage.image.naturalWidth,
              },
            });

            return (
              <div
                style={{
                  height,
                }}
                key={i}
              >
                <OnContainerMeasurementsReady
                  height={height}
                  loading={loading}
                  width={containerMeasurements.width}
                />
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Image;

const OnContainerMeasurementsReady = ({
  height,
  loading,
  width,
}: {
  width: number;
  height: number;
  loading: "eager" | "lazy";
}) => {
  const albumImage = useAlbumImageContext();

  return (
    <MyCldImage
      dimensions={{ height, width }}
      src={albumImage.image.cloudinary_public_id}
      loading={loading}
    />
  );
};
