import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const myId = "about-text-id";

export const aboutPageRouter = createTRPCRouter({
  getText: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.aboutPage.findUnique({
      where: {
        id: myId,
      },
    });
  }),
});
