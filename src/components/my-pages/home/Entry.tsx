import NextImage from "next/image";
import Link from "next/link";

import SiteLayout from "~/components/layout/Site";
import MainMenu from "~/components/main-menu";
import { localImage } from "~/assets/images";

const HomePage = () => {
  return (
    <SiteLayout>
      <>
        <MainMenu />
        <PageContent />
      </>
    </SiteLayout>
  );
};

export default HomePage;

const PageContent = () => {
  return (
    <div className="flex justify-center">
      <div className="relative h-[90vh] w-[80vw]">
        <NextImage
          className="h-full w-full object-cover"
          loading="eager"
          quality={100}
          placeholder="blur"
          src={localImage.home}
          alt=""
        />
        <MainTitle />
        <div className="mt-2 flex items-center justify-end gap-6">
          <PageLink href="/albums" text="Albums" />
          <PageLink href="" text="Videos" />
          <PageLink href="" text="About" />
        </div>
      </div>
    </div>
  );
};

const MainTitle = () => {
  return (
    <h1 className="absolute top-[35%] -left-[80px] text-7xl tracking-wider">
      Piros <br />
      Photography
    </h1>
  );
};

const PageLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <Link href={href} passHref>
      <div className="uppercase">{text}</div>
    </Link>
  );
};
