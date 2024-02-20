import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const albumImageCommentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        data: z.object({
          text: z.string(),
          userId: z.string(),
          albumImageId: z.string(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumImageComment.create({
        data: input.data,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        where: z.object({ commentId: z.string() }),
        data: z.object({
          text: z.string(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumImageComment.update({
        where: {
          id: input.where.commentId,
        },
        data: {
          text: input.data.text,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        where: z.object({ commentId: z.string() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumImageComment.delete({
        where: {
          id: input.where.commentId,
        },
      });
    }),
});
