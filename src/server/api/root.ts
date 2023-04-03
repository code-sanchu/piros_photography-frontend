import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";
import { albumImageCommentRouter } from "./routers/albumImageComment";
import { albumImageLikeRouter } from "./routers/albumImageLike";
import { albumsPageRouter } from "./routers/albumsPage";

export const appRouter = createTRPCRouter({
  album: albumRouter,
  albumImageComment: albumImageCommentRouter,
  albumImageLike: albumImageLikeRouter,
  albumsPage: albumsPageRouter,
});

export type AppRouter = typeof appRouter;
