const nextConfig = {
	reactStrictMode: true,

	swcMinify: true,
	images: {
		domains: ['localhost']
	},
	experimental: {
		appDir: true
	}
};

module.exports = nextConfig;
