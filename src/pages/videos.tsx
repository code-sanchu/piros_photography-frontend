import { type NextPage } from "next";

import PageContent from "~/videos/Entry";

export { getStaticProps } from "~/videos/staticData";

const VideosPage: NextPage = () => {
  return <PageContent />;
};

export default VideosPage;
