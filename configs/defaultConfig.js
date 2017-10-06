module.exports = {
	env: 'production',        // Can be 'development' or 'production'.

	protocol: 'http',         // Using `https` requires valid certificates.
	hostname: '0.0.0.0',      // Can be 0.0.0.0 for binding to all ports.
	port: 3000,               // Port of webserver.

	apiToken: '',             // LIFX HTTP API Key (https://api.developer.lifx.com/)
}
