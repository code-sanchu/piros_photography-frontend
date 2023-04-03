import NextImage from "next/image";
import { useSession } from "next-auth/react";

import { UserIcon } from "~/components/icon";

export const UserImage = ({ sideSize }: { sideSize: number }) => {
  const session = useSession();

  return (
    <div>
      {session.data?.user.image ? (
        <NextImage
          className="rounded-full"
          alt=""
          src={session.data.user.image}
          width={sideSize}
          height={sideSize}
        />
      ) : (
        <div
          className="rounded-full"
          style={{ width: sideSize, height: sideSize }}
        >
          <UserIcon />
        </div>
      )}
    </div>
  );
};
