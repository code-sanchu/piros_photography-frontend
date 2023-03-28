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
});
