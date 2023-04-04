import Link from "next/link";
import { useRouter } from "next/router";

import Account from "./user/Entry";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <Logo />
      <RightSide />
    </div>
  );
};

export default Header;

const Logo = () => {
  return (
    <Link href="/" passHref>
      <h2 className="uppercase tracking-widest">
        <span className="text-xl">P</span>iros
        <br />
        <span className="text-xl">P</span>hotography
      </h2>
    </Link>
  );
};

const RightSide = () => {
  const router = useRouter();
  const currentRoute = router.route;

  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-8">
        {currentRoute !== "/albums" ? (
          <PageLink href="/albums">albums</PageLink>
        ) : null}
        {currentRoute !== "/videos" ? (
          <PageLink href="/videos">videos</PageLink>
        ) : null}
        {currentRoute !== "/about" ? (
          <PageLink href="/about">about</PageLink>
        ) : null}
      </div>
      <Account />
    </div>
  );
};

const PageLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <Link href={href} passHref>
      <p className="text-sm uppercase tracking-wide">{children}</p>
    </Link>
  );
};
