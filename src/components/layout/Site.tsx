import { type ReactElement } from "react";
import Head from "next/head";

const SiteLayout = ({
  children,
  pageTitle = "Piros Photography",
}: {
  children: ReactElement;
  pageTitle?: string;
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Beautiful photos from Piroska Markus"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
};

export default SiteLayout;
