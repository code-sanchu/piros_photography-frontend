/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { type ReactElement } from "react";

import { type RouterOutputs } from "~/utils/api";
import Header from "~/components/header2/Entry";

type PageText = NonNullable<RouterOutputs["aboutPage"]["getText"]>;

const AlbumsPage = () => {
  return (
    <Layout>
      <div className="mt-16">Hello</div>
    </Layout>
  );
};

export default AlbumsPage;

const Layout = ({ children }: { children: ReactElement | ReactElement[] }) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <div className="flex justify-center">
        <div className="w-full max-w-[1800px] p-8">{children}</div>
      </div>
    </div>
  );
};
