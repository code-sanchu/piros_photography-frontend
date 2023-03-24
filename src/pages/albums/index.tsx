import { type NextPage } from "next";

import { PageContent, type StaticData } from "~/albums/index";

export { getStaticProps } from "~/albums/index";

const AlbumsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />;
};

export default AlbumsPage;
