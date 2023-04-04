import Link from "next/link";
import { useSession } from "next-auth/react";

import { routes } from "~/data/routes";
import AuthenticatedMenu from "./AuthenticatedMenu";

const Account = () => {
  const session = useSession();

  return session.status === "loading" ? <div>Loading...</div> : <OnLoad />;
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
      <p className="text-sm text-gray-600">Sign in</p>
    </Link>
  ) : (
    <AuthenticatedMenu />
  );
};