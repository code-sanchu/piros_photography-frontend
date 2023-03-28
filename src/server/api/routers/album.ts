import { z } from "zod";

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
          {
            images: { some: {} },
          },
        ],
      },
      orderBy: { index: "asc" },
      include: { coverImage: true },
    });
  }),

  albumPageGetOne: publicProcedure
    .input(z.object({ albumId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.album.findUnique({
        where: {
          id: input.albumId,
        },
        include: {
          images: {
            include: {
              image: true,
              comments: { orderBy: { createdAt: "desc" } },
            },
            orderBy: { index: "asc" },
          },
        },
      });
    }),
});
