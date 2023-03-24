import type { GetStaticProps } from "next";
// import { prisma } from "~/server/db";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

// import { createProxySSGHelpers } from "@trpc/react-query/ssg";

export type StaticData = {
  a: "hello";
};

/* export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const albums = await prisma.album.findMany({ where: { published: true } });
  console.log("albums:", albums);

  return {
    props: {
      a: "hello",
    },
  };
};  */

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  const albums = await ssg.album.albumsPageGetAll.fetch();
  console.log("albums:", albums);
  ssg.dehydrate();

  return {
    props: {
      a: "hello",
    },
  };
};
