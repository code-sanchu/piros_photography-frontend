import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";
import { albumImageCommentRouter } from "./routers/albumImageComment";
import { albumsPageRouter } from "./routers/albumsPage";

export const appRouter = createTRPCRouter({
  album: albumRouter,
  albumImageComment: albumImageCommentRouter,
  albumsPage: albumsPageRouter,
});

export type AppRouter = typeof appRouter;
