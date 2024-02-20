import PageContent from "~/album/Entry";
import { type StaticData } from "~/album/staticData";

export { getStaticPaths, getStaticProps } from "~/album/staticData";

const AlbumPage = (props: StaticData) => {
  return <PageContent {...props} />;
};

export default AlbumPage;
