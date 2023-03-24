import { type NextPage } from "next";

// import { type GetStaticProps, type NextPage } from "next";

import PageContent from "~/components/my-pages/albums/Entry";
import { type StaticData } from "~/components/my-pages/albums/staticData";

// import { prisma } from "~/server/db";

// import { PageContent, type StaticData } from "~/albums/index";

export { getStaticProps } from "~/albums/staticData";

const AlbumsPage: NextPage<StaticData> = (staticData) => {
  return <PageContent {...staticData} />;
};

export default AlbumsPage;

/* export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const albums = await prisma.album.findMany({ where: { published: true } });
  console.log("albums:", albums);

  return {
    props: {
      a: "hello",
    },
  };
};
 */
