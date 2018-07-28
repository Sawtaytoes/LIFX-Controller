const fs = require('fs')

const dir = require(`${global.baseDir}directories`)
const config = require(`${dir.configs}`)
const logger = require(`${dir.utils}logger`)

const secureServer = serverSettings => {
	const https = require('https')
	const enforce = require('express-sslify')

	serverSettings
	.use(enforce.HTTPS({ trustProtoHeader: true }))

	return https.createServer({
		cert: fs.readFileSync('./conf/domain-crt.txt'),
		key: fs.readFileSync('./conf/key.pem'),
	}, serverSettings)
}

module.exports = server => (
	(
		config.isSecure()
		? secureServer(server)
		: server
	)
	.listen(config.getPort(), err => {
		err
		? logger.logError(err)
		: (
			logger.log(
				'Web Server running as',
				config.getServerUrl()
			)
		)
	})
)
