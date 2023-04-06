import { createTRPCRouter } from "~/server/api/trpc";
import { aboutPageRouter } from "./routers/aboutPage";
import { albumRouter } from "./routers/album";
import { albumImageCommentRouter } from "./routers/albumImageComment";
import { albumImageLikeRouter } from "./routers/albumImageLike";
import { albumsPageRouter } from "./routers/albumsPage";
import { userRouter } from "./routers/user";
import { videoRouter } from "./routers/video";

export const appRouter = createTRPCRouter({
  aboutPage: aboutPageRouter,
  album: albumRouter,
  albumImageComment: albumImageCommentRouter,
  albumImageLike: albumImageLikeRouter,
  albumsPage: albumsPageRouter,
  video: videoRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
