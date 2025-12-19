/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.pexels.com",
				port: "",
				pathname: "/**",
			}
		],

		formats: ["image/avif", "image/webp"],
	},
	compress: true,
	poweredByHeader: false,
	generateEtags: true,
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		optimizeCss: false,
	},
	transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
	// Increase chunk loading timeout to prevent ChunkLoadError
	webpack: (config, { isServer }) => {
		// Adjust chunk request timeout (in milliseconds)
		config.output.chunkLoadingGlobal = 'webpackJsonpCallback';

		// For client-side, adjust chunk splitting
		if (!isServer) {
			// Ensure optimization.splitChunks exists
			if (!config.optimization) {
				config.optimization = {};
			}
			if (!config.optimization.splitChunks) {
				config.optimization.splitChunks = {};
			}

			// Set cacheGroups for chunk splitting
			config.optimization.splitChunks.cacheGroups = {
				...config.optimization.splitChunks.cacheGroups,
				// Split large vendor chunks to prevent loading issues
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
					enforce: true,
					maxSize: 244000, // 244 KB
				},
			};
		}

		return config;
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
				],
			},
		];
	},
};

export default nextConfig;