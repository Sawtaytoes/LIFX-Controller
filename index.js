// Global Dir Hack
global.baseDir = `${__dirname}/`

// Load Config settings
const dir = require(`${global.baseDir}/global-dirs`)
const lifxConfig = require(`${dir.services}setup-lifx-config`)
const lifxClient = require(`${dir.services}setup-lifx-client`)
const setupServer = require(`${dir.server}setup-server`)
const startServer = require(`${dir.server}start-server`)

// Load Middleware
const discoverDevices = require(`${dir.middleware}discover-devices`)
const toggleGroup = require(`${dir.middleware}toggle-group`)
const toggleScene = require(`${dir.middleware}toggle-scene`)
const toggleScenes = require(`${dir.middleware}toggle-scenes`)

lifxClient.init()
lifxConfig.init()

const serverSettings = setupServer()

serverSettings.get(
	'/',
	(req, res) => res.end('You no be hearz.')
)

serverSettings.get(
	'/discover-devices',
	(req, res) => res.send(
		discoverDevices(lifxClient, lifxConfig)
	)
)

serverSettings.get(
	'/toggle-group/:groupName',
	(req, res) => res.send(
		toggleGroup(lifxClient, lifxConfig)(req.params.groupName)
	)
)

serverSettings.get(
	'/toggle-scene/:sceneName',
	(req, res) => res.send(
		toggleScene(lifxClient, lifxConfig)(req.params.sceneName)
	)
)

serverSettings.put(
	'/toggle-scenes',
	(req, res) => res.send(
		toggleScenes(lifxClient, lifxConfig)(req.body.sceneNames)
	)
)

startServer(serverSettings)

const DEVICE_DISCOVERY_INTERVAL = 3600

setInterval(
	() => discoverDevices(lifxClient, lifxConfig),
	DEVICE_DISCOVERY_INTERVAL
)
