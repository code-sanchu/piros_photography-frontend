import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const albumImageLikeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        data: z.object({
          userId: z.string(),
          albumImageId: z.string(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumImageLike.create({
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        where: z.object({ likeId: z.string() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumImageLike.delete({
        where: {
          id: input.where.likeId,
        },
      });
    }),
});
