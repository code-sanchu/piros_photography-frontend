import { type ReactElement } from "react";
import Head from "next/head";

const SiteLayout = ({
  children,
  pageTitle,
}: {
  children: ReactElement;
  pageTitle?: string;
}) => {
  return (
    <>
      <Head>
        <title>Piros Photography{pageTitle ? ` - ${pageTitle}` : ""}</title>
        <meta
          name="description"
          content="Photography portfolio of Piroska Markus"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default SiteLayout;
