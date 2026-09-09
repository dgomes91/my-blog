import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type VideoEmbedProps = SliceComponentProps<Content.VideoEmbedSlice>;

const VideoEmbed: FC<VideoEmbedProps> = ({ slice }) => {
  const embed = slice.primary.video;
  if (!embed || !("html" in embed) || !embed.html) return null;

  return (
    <figure
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="max-w-3xl mx-auto px-4 py-6"
    >
      <div
        className="aspect-video w-full overflow-hidden bg-black [&_iframe]:w-full [&_iframe]:h-full"
        dangerouslySetInnerHTML={{ __html: embed.html }}
      />
      {slice.primary.caption && (
        <figcaption
          className="mt-2 text-xs text-muted-foreground"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {slice.primary.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default VideoEmbed;
