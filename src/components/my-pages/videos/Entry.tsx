import { type ReactElement } from "react";
import { useMeasure } from "@react-hookz/web";

import { api } from "~/utils/api";
import YoutubeIFrame from "~/components/YoutubeIframe";
import Header from "~/components/header/Entry";
import { getYoutubeEmbedUrlFromId } from "~/helpers/youtube";
import { type Video } from "./_types";

const VideosPage = () => {
  return (
    <Layout>
      <div className="mt-8 sm:mt-12">
        <Titles />
      </div>
      <div className="mt-6 sm:mt-12">
        <Videos />
      </div>
    </Layout>
  );
};

export default VideosPage;

const Layout = ({ children }: { children: ReactElement | ReactElement[] }) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-[1200px] p-8">{children}</div>
      </div>
    </div>
  );
};

const Titles = () => {
  return (
    <div>
      <h1 className="font-sans-secondary text-6xl font-light tracking-wide  md:text-7xl">
        Videos
      </h1>
      <p className=" mt-2 font-serif-3 text-lg">
        See more on youtube{" "}
        <a
          href="https://www.youtube.com/playlist?list=PLdAjHO5OZG7y9CGvEG3Cf3ZgcaCL_p9fZ"
          target="_blank"
          className="transition-colors duration-75 ease-in-out hover:text-gray-900"
        >
          @piroska markus
        </a>
      </p>
    </div>
  );
};

const Videos = () => {
  const { data } = api.video.videosPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const videos = data as Video[];

  return (
    <div className="flex flex-col gap-12">
      {videos.map((video) => (
        <Video video={video} key={video.id} />
      ))}
    </div>
  );
};

const Video = ({ video }: { video: Video }) => {
  const [containerMeasurements, containerRef] = useMeasure<HTMLDivElement>();

  return (
    <div>
      {video.title?.length ? (
        <h2 className="font-sans-secondary uppercase tracking-wider">
          <span className="text-xl">{video.title?.slice(0, 1)}</span>
          <span className="text-lg">
            {video.title?.slice(1, video.title.length)}
          </span>
        </h2>
      ) : null}
      {video.description?.length ? (
        <p className="mb-2 font-serif-3 text-lg">{video.description}</p>
      ) : null}
      <div className="aspect-video" ref={containerRef}>
        {containerMeasurements?.width ? (
          <YoutubeIFrame
            height={containerMeasurements.height}
            src={getYoutubeEmbedUrlFromId(video.youtubeVideoId)}
            width={containerMeasurements.width}
          />
        ) : null}
      </div>
    </div>
  );
};
