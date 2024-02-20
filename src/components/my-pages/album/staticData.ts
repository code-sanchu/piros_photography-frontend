import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export type StaticData = InferGetStaticPropsType<typeof getStaticProps>;

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  const albumId = context.params?.id as string;

  await ssg.album.albumPageGetOne.prefetch({ albumId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      albumId,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const albums = await prisma.album.findMany({
    select: {
      id: true,
    },
    where: {
      AND: [
        { published: true },
        {
          coverImage: { isNot: null },
        },
        {
          images: { some: {} },
        },
      ],
    },
  });

  return {
    paths: albums.map((album) => ({
      params: {
        id: album.id,
      },
    })),
    fallback: false,
  };
};
