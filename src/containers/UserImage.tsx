import NextImage from "next/image";

import { UserIcon } from "~/components/icon";

export const UserImage = ({
  sideSize,
  src,
}: {
  sideSize: number;
  src: string | undefined | null;
}) => {
  return (
    <div>
      {src ? (
        <NextImage
          className="rounded-full"
          alt=""
          src={src}
          width={sideSize}
          height={sideSize}
        />
      ) : (
        <div
          className="rounded-full text-gray-400"
          style={{ width: sideSize, height: sideSize }}
        >
          <UserIcon width={sideSize} height={sideSize} />
        </div>
      )}
    </div>
  );
};
