import Link from "next/link";
import { Spinner } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";

import WithTooltip from "~/components/WithTooltip";
import { UserIcon } from "~/components/icon";
import { routes } from "~/data/routes";
import AuthenticatedMenu from "./AuthenticatedMenu";

const Account = () => {
  const session = useSession();

  return session.status === "loading" ? (
    <WithTooltip text="Loading user...">
      <div className="relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full text-xs text-gray-300">
          <Spinner />
        </div>
        <UserIcon
          className="text-gray-200"
          style={{ height: 33.2, width: 33.2 }}
          weight="light"
        />
      </div>
    </WithTooltip>
  ) : (
    <OnLoad />
  );
};

export default Account;

const OnLoad = () => {
  const session = useSession();
  const status = session.status as Exclude<
    (typeof session)["status"],
    "loading"
  >;

  return status === "unauthenticated" ? (
    <Link href={routes.signIn} passHref>
      <p className="text-sm ">Sign in</p>
    </Link>
  ) : (
    <div className="text-gray-900" style={{ height: 33.2 }}>
      <AuthenticatedMenu />
    </div>
  );
};
