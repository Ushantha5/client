import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "MR5 School - Learn with AI",
		short_name: "MR5 School",
		description: "Advanced online learning platform with AI-powered avatars and interactive courses",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#3b82f6",
		icons: [
			{
				src: "/icon.png",
				sizes: "any",
				type: "image/png",
			},
		],
		categories: ["education", "learning", "courses"],
	};
}

