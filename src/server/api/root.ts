import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";
import { albumImageCommentRouter } from "./routers/albumImageComment";

export const appRouter = createTRPCRouter({
  album: albumRouter,
  albumImageComment: albumImageCommentRouter,
});

export type AppRouter = typeof appRouter;
