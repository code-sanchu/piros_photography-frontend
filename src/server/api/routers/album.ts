import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const albumRouter = createTRPCRouter({
  albumsPageGetAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.album.findMany({
      where: { published: true },
      orderBy: { index: "asc" },
      include: { coverImage: true },
    });
  }),
});
