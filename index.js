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
const setLightsBrightness = require(`${dir.middleware}set-lights-brightness`)
const toggleGroup = require(`${dir.middleware}toggle-group`)
const toggleLights = require(`${dir.middleware}toggle-lights`)
const toggleScenes = require(`${dir.middleware}toggle-scenes`)
const turnOffGroup = require(`${dir.middleware}turn-off-group`)

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
	'/set-light-brightness/:lightName/:brightness',
	({ params: { brightness, lightName } }, res) => res.send(
		setLightsBrightness(lifxClient, lifxConfig)([{ brightness, lightName }])
	)
)

serverSettings.put(
	'/set-lights-brightness',
	({ body: { lightConfigs } }, res) => res.send(
		setLightsBrightness(lifxClient, lifxConfig)(lightConfigs)
	)
)

serverSettings.get(
	'/toggle-group/:groupName',
	({ params: { groupName } }, res) => res.send(
		toggleGroup(lifxClient, lifxConfig)([groupName])
	)
)

serverSettings.put(
	'/toggle-groups',
	({ body: { names } }, res) => res.send(
		toggleLights(lifxClient, lifxConfig)(names)
	)
)

serverSettings.get(
	'/toggle-light/:lightName',
	({ params: { lightName } }, res) => res.send(
		toggleLights(lifxClient, lifxConfig)([lightName])
	)
)

serverSettings.put(
	'/toggle-lights',
	({ body: { names } }, res) => res.send(
		toggleLights(lifxClient, lifxConfig)(names)
	)
)

serverSettings.get(
	'/toggle-scene/:sceneName',
	({ params: { sceneName } }, res) => res.send(
		toggleScenes(lifxClient, lifxConfig)([sceneName])
	)
)

serverSettings.put(
	'/toggle-scenes',
	({ body: { names } }, res) => res.send(
		toggleScenes(lifxClient, lifxConfig)(names)
	)
)

serverSettings.get(
	'/turn-off-group/:groupName',
	({ params: { groupName } }, res) => res.send(
		turnOffGroup(lifxClient, lifxConfig)([groupName])
	)
)

serverSettings.put(
	'/turn-off-groups',
	({ body: { names } }, res) => res.send(
		turnOffGroup(lifxClient, lifxConfig)(names)
	)
)

startServer(serverSettings)

const DEVICE_DISCOVERY_INTERVAL = 600000 // 10 minutes

setInterval(
	() => discoverDevices(lifxClient, lifxConfig),
	DEVICE_DISCOVERY_INTERVAL
)
