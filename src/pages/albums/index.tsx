import { type NextPage } from "next";

import PageContent from "~/albums/Entry";

export { getStaticProps } from "~/albums/staticData";

const AlbumsPage: NextPage = () => {
  return <PageContent />;
};

export default AlbumsPage;
