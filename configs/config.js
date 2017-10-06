const fs = require('fs')

const dir = require(`${global.baseDir}directories`)
const defaultConfig = require(`${dir.configs}defaultConfig`)
const envConfig = require(`${dir.configs}envConfig`)

const configFilePath = `${dir.configs}customConfig.js`
const customConfig = (
	fs.existsSync(configFilePath)
	? require(configFilePath)
	: {}
)

const config = {
	...defaultConfig,
	...envConfig,
	...customConfig
}

config.port = Number(config.port)

module.exports = {
	getApiToken: () => config.apiToken,
	getEnv: () => config.env,
	getHostname: () => config.hostname,
	getPort: () => config.port,
	getProtocol: () => config.protocol,
	getSafeUrl: portFunc => portFunc().replace('0.0.0.0', 'localhost'),
	getServerUrl: () => `${config.protocol}://${config.hostname}:${config.port}`,
	isDev: () => config.env === 'development',
	isProd: () => config.env === 'production',
	isSecure: () => config.protocol === 'https',
}
