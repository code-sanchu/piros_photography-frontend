import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const albumRouter = createTRPCRouter({
  albumsPageGetAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.album.findMany({
      where: {
        AND: [
          { published: true },
          {
            coverImage: { isNot: null },
          },
        ],
      },
      orderBy: { index: "asc" },
      include: { coverImage: true },
    });
  }),
});
