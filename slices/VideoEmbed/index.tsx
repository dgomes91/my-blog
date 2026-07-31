import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `VideoEmbed`.
 */
export type VideoEmbedProps = SliceComponentProps<Content.VideoEmbedSlice>;

/**
 * Component for "Video Embed" Slices.
 */
const VideoEmbed: FC<VideoEmbedProps> = ({ slice }) => {
	return (
		<section
			data-slice-type={slice.slice_type}
			data-slice-variation={slice.variation}
		>
			Placeholder component for {slice.slice_type} (variation: {slice.variation}) slices.
			<br />
			<strong>You can edit this slice directly in your code editor.</strong>
		</section>
	)
};

export default VideoEmbed