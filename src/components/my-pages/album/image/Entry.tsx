import { useMeasure } from "@react-hookz/web";

import MyCldImage from "~/components/image/MyCldImage";
import { Modal } from "~/components/modal";
import { calcImgHeightForWidth } from "~/helpers/transformation";
import { useAlbumImageContext } from "../_context";
import OpenedImage from "./opened-image/Entry";

const AlbumImage = () => {
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
                  width={containerMeasurements.width}
                />
              </div>
            );
          })
        : null}
    </div>
  );
};

export default AlbumImage;

const OnContainerMeasurementsReady = (imageDimensions: {
  width: number;
  height: number;
}) => {
  const albumImage = useAlbumImageContext();

  return (
    <Modal
      button={({ openModal }) => (
        <div className="h-full cursor-pointer" onClick={openModal}>
          <MyCldImage
            dimensions={imageDimensions}
            src={albumImage.image.cloudinary_public_id}
          />
        </div>
      )}
      panelContent={<OpenedImage unopenedDimensions={imageDimensions} />}
    />
  );
};
