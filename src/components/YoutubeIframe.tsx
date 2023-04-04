import { env } from "~/env.mjs";

const YoutubeIFrame = ({
  height,
  src,
  width,
}: {
  width: number;
  height: number;
  src: string;
}) => {
  const youtubeIframeParams = `?modestbranding=1&rel=0&color=white&frameborder=0&origin=${env.NEXT_PUBLIC_DOMAIN}`;

  return (
    <iframe
      width={width}
      height={height}
      src={src + youtubeIframeParams}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default YoutubeIFrame;
