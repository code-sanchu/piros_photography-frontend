import { type NextPage } from "next";

import PageContent from "~/about/Entry";

export { getStaticProps } from "~/about/staticData";

const AboutPage: NextPage = () => {
  return <PageContent />;
};

export default AboutPage;
