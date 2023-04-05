import { useState } from "react";
import { useWindowSize } from "@react-hookz/web";
import { CldImage } from "next-cloudinary";

import { calcDimensions } from "~/helpers/transformation";
import { useAlbumImageContext } from "../../_context";

const Image = ({
  unopenedDimensions,
}: {
  unopenedDimensions: { width: number; height: number };
}) => {
  const [fullSizeImgIsLoaded, setFullSizeImgIsLoaded] = useState(false);

  const albumImage = useAlbumImageContext();
  const windowSize = useWindowSize();

  const openedDimensions = calcDimensions({
    initialDimensions: {
      height: albumImage.image.naturalHeight,
      width: albumImage.image.naturalWidth,
    },
    transformTo: {
      maxValue: {
        height: windowSize.height,
        width: windowSize.width,
      },
      maxDecimal: { width: 0.9, height: 0.7 },
    },
  });

  const openedImageIsLarger =
    openedDimensions.width > unopenedDimensions.width &&
    openedDimensions.height > unopenedDimensions.height;

  return (
    <div className="relative flex-shrink-0" style={openedDimensions}>
      <CldImage
        className={`absolute left-0 top-0 h-full w-full ${
          fullSizeImgIsLoaded ? "opacity-0" : "opacity-100"
        }`}
        src={albumImage.image.cloudinary_public_id}
        {...unopenedDimensions}
        alt=""
        loading="lazy"
      />
      {openedImageIsLarger ? (
        <CldImage
          className={`absolute left-0 top-0 h-full w-full ${
            fullSizeImgIsLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={albumImage.image.cloudinary_public_id}
          {...openedDimensions}
          onLoad={() => setFullSizeImgIsLoaded(true)}
          alt=""
          loading="lazy"
        />
      ) : null}
    </div>
  );
};

export default Image;
