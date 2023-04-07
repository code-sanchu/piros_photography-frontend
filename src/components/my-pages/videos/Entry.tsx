import { type ReactElement } from "react";
import { useMeasure } from "@react-hookz/web";

import { api } from "~/utils/api";
import YoutubeIFrame from "~/components/YoutubeIframe";
import Header from "~/components/header/Entry";
import SiteLayout from "~/components/layout/Site";
import { getYoutubeEmbedUrlFromId } from "~/helpers/youtube";
import { type Video } from "./_types";

const VideosPage = () => (
  <SiteLayout pageTitle="Videos - Piros Photography">
    <PageLayout>
      <Titles />
      <div className="mt-6 pb-12 sm:mt-8 md:mt-12">
        <Videos />
      </div>
    </PageLayout>
  </SiteLayout>
);

export default VideosPage;

const PageLayout = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => (
  <div className="min-h-screen overflow-x-hidden">
    <Header />
    <div className="mt-24 flex justify-center px-4 xs:px-6 sm:px-8 md:mt-28">
      <div className="w-full max-w-[1200px]">{children}</div>
    </div>
  </div>
);

const Titles = () => (
  <div>
    <h1 className="uppercase tracking-wider">
      <span className="text-5xl md:text-6xl">V</span>
      <span className="text-4xl md:text-5xl">ideos</span>
    </h1>
    <p className="mt-6 text-sm font-light sm:mt-8 sm:text-base md:mt-12">
      Youtube{" "}
      <a
        href="https://www.youtube.com/playlist?list=PLdAjHO5OZG7y9CGvEG3Cf3ZgcaCL_p9fZ"
        target="_blank"
        className="text-blue-600 transition-colors duration-75 ease-in-out hover:text-blue-800"
      >
        @piroska markus
      </a>
    </p>
  </div>
);

const Videos = () => {
  const { data } = api.video.videosPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const videos = data as Video[];

  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
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
        <h2 className="mb-2 font-sans-secondary text-base font-light tracking-wide">
          <span className="text-xl">{video.title?.slice(0, 1)}</span>
          <span className="text-lg">
            {video.title?.slice(1, video.title.length)}
          </span>
        </h2>
      ) : null}
      {video.description?.length ? (
        <p className="mb-4 -mt-0.5 font-serif-3 text-lg leading-6">
          {video.description}
        </p>
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
