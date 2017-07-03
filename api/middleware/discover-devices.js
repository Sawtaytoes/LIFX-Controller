const Promise = require('bluebird')

const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const DURATION = 30000

module.exports = (lifxClient, lifxConfig) => {
	logger.log('Command: Discover Devices')

	lifxConfig.update()
	lifxClient.startDiscovery()

	Promise.delay(DURATION)
	.then(() => lifxClient.stopDiscovery())
	.then(() => logger.log('Discover Devices: Complete'))
	.catch(err => console.error('Discover Devices:', err))
}
