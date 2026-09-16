import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		background_color: "#12121c",
		description: "Save your files to the cloud",
		display: "minimal-ui",
		icons: [
			{
				purpose: "any",
				sizes: "192x192",
				src: "/web-app-manifest-192x192.png",
				type: "image/png",
			},
			{
				purpose: "maskable",
				sizes: "192x192",
				src: "/web-app-manifest-192x192.png",
				type: "image/png",
			},
			{
				purpose: "any",
				sizes: "512x512",
				src: "/web-app-manifest-512x512.png",
				type: "image/png",
			},
			{
				purpose: "maskable",
				sizes: "512x512",
				src: "/web-app-manifest-512x512.png",
				type: "image/png",
			},
		],
		name: "Drive",
		short_name: "Drive",
		start_url: "/",
		theme_color: "#12121c",
	};
}
