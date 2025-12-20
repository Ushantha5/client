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
		optimizeCss: true,
		serverComponentsExternalPackages: ["@splinetool/runtime", "@splinetool/react-spline"],
	},
	// Increase chunk loading timeout to prevent ChunkLoadError
	webpack: (config, { isServer, dev }) => {
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
				// Split framework chunks
				framework: {
					test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
					name: 'framework',
					chunks: 'all',
					enforce: true,
				},
			};
		}

		// Enable top level await for server components
		config.experiments = {
			...config.experiments,
			topLevelAwait: true,
		};

		// Optimize for production
		if (!dev) {
			config.optimization.minimize = true;
			config.optimization.concatenateModules = true;
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
					{
						key: "Permissions-Policy",
						value: "camera=*, microphone=*, geolocation=*",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
				],
			},
			{
				source: "/sw.js",
				headers: [
					{
						key: "Cache-Control",
						value: "no-cache, no-store, must-revalidate",
					},
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8",
					},
				],
			},
		];
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:5000/api/:path*',
			},
		];
	},
};

export default nextConfig;