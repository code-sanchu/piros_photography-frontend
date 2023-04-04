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
      <div className="mt-8">
        <Titles />
      </div>
      <div className="mt-12">
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
      <div className="flex justify-center">
        <div className="w-full max-w-[1200px] p-8">{children}</div>
      </div>
    </div>
  );
};

const Titles = () => {
  return (
    <div>
      <h1 className="text-7xl">Videos</h1>
      <p className="mt-4 font-serif text-gray-500">
        See more on youtube{" "}
        <a
          href="https://www.youtube.com/playlist?list=PLdAjHO5OZG7y9CGvEG3Cf3ZgcaCL_p9fZ"
          target="_blank"
          className="text-gray-700 transition-colors duration-75 ease-in-out hover:text-gray-900"
        >
          @piroska markus
        </a>
      </p>
    </div>
  );
};

const Videos = () => {
  const { data } = api.videos.videosPageGetAll.useQuery(undefined, {
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
        <h2 className="mb-2 text-xl">{video.title}</h2>
      ) : null}
      {video.description?.length ? (
        <p className="mb-2 font-serif">{video.description}</p>
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
