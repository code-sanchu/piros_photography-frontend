import { useState } from "react";
import { CldImage } from "next-cloudinary";

import { SpinnerIcon } from "~/components/icon";

const MyCldImage = ({
  src,
  initialDimensions,
}: {
  src: string;
  initialDimensions: { width: number; height: number };
}) => {
  const [blurImgIsLoaded, setBlurImgIsLoaded] = useState(false);
  const [qualityImgIsLoaded, setQualityImgIsLoaded] = useState(false);

  return (
    <div className="relative grid flex-grow place-items-center bg-gray-50">
      <div
        className={`transition-opacity my-abs-center ${
          !blurImgIsLoaded && !qualityImgIsLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <SpinnerIcon />
      </div>
      <CldImage
        className={`absolute left-0 top-0 h-full w-full ${
          !blurImgIsLoaded || qualityImgIsLoaded ? "opacity-0" : "opacity-100"
        }`}
        src={src}
        {...initialDimensions}
        effects={[{ blur: "1000" }]}
        quality={1}
        alt=""
        onLoad={() => setBlurImgIsLoaded(true)}
        loading="lazy"
      />
      <CldImage
        className={`absolute left-0 top-0 h-full w-full ${
          !qualityImgIsLoaded ? "opacity-0" : "opacity-100"
        }`}
        src={src}
        {...initialDimensions}
        alt=""
        onLoad={() => setQualityImgIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default MyCldImage;
