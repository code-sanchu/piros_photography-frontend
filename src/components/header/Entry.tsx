import Link from "next/link";

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
    <h2 className="uppercase tracking-wide">
      <span className="text-xl">P</span>iros
      <br />
      <span className="text-xl">P</span>hotography
    </h2>
  );
};

const RightSide = () => {
  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-8">
        <PageLink>videos</PageLink>
        <PageLink>about</PageLink>
      </div>
      <Account />
    </div>
  );
};

const PageLink = ({ children }: { children: string }) => {
  return (
    <Link href={""} passHref>
      <p className="text-sm uppercase">{children}</p>
    </Link>
  );
};

// Side menu
// - links: home, albums, videos, about
// - account?
// - about info. eg. social links.
