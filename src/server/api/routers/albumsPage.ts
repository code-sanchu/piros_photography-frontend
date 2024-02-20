import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const myId = "albums-page-id";

export const albumsPageRouter = createTRPCRouter({
  getText: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.albumsPage.findUnique({
      where: {
        id: myId,
      },
    });
  }),
});
