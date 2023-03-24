import { type NextPage } from "next";

import PageContent from "~/components/my-pages/albums/Entry";

export { getStaticProps } from "~/albums/staticData";

const AlbumsPage: NextPage = () => {
  return <PageContent />;
};

export default AlbumsPage;
