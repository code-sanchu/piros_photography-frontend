import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const videosRouter = createTRPCRouter({
  videosPageGetAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.youtubeVideo.findMany({
      orderBy: { index: "asc" },
    });
  }),
});
