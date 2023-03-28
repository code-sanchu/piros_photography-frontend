import Link from "next/link";

import { routes } from "~/data/routes";

const Account = () => {
  return (
    <Link href={routes.signIn} passHref>
      <div>Sign in</div>
    </Link>
  );
};

export default Account;
