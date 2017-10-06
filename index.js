// Global Dir Hack
global.baseDir = `${__dirname}/`

// Load Config settings
const dir = require(`${global.baseDir}directories`)
const lifxClient = require(`${dir.services}lifxClient`)
const lifxConfig = require(`${dir.services}lifxConfig`)
const setupServer = require(`${dir.server}setupServer`)
const startServer = require(`${dir.server}startServer`)

// Load Middleware
const discoverDevices = require(`${dir.middleware}discoverDevices`)
const setLightsBrightness = require(`${dir.middleware}setLightsBrightness`)
const toggleGroups = require(`${dir.middleware}toggleGroups`)
const toggleLights = require(`${dir.middleware}toggleLights`)
const toggleScenes = require(`${dir.middleware}toggleScenes`)
const turnOffGroups = require(`${dir.middleware}turnOffGroups`)

lifxClient.init()
lifxConfig.init()

const server = setupServer()

server.get(
	'/',
	(req, res) => res.end('You no be hearz.')
)

server.get(
	'/discover-devices',
	(req, res) => (
		res.send(
			discoverDevices(lifxClient, lifxConfig)
		)
	)
)

server.get(
	'/set-light-brightness/:lightName/:brightness',
	({ params: { brightness, lightName } }, res) => (
		res.send(
			setLightsBrightness(lifxClient, lifxConfig)([{ brightness, lightName }])
		)
	)
)

server.put(
	'/set-lights-brightness',
	({ body: { lightConfigs } }, res) => (
		res.send(
			setLightsBrightness(lifxClient, lifxConfig)(lightConfigs)
		)
	)
)

server.get(
	'/toggle-group/:groupName',
	({ params: { groupName } }, res) => (
		res.send(
			toggleGroups(lifxClient, lifxConfig)([groupName])
		)
	)
)

server.put(
	'/toggle-group',
	({ body: { names } }, res) => (
		res.send(
			toggleGroups(lifxClient, lifxConfig)(names)
		)
	)
)

server.get(
	'/toggle-light/:name',
	({ params: { name } }, res) => (
		res.send(
			toggleLights([name])
		)
	)
)

server.put(
	'/toggle-light',
	({ body: { names } }, res) => (
		res.send(
			toggleLights(lifxClient, lifxConfig)(names)
		)
	)
)

server.get(
	'/toggle-scene/:sceneName',
	({ params: { sceneName } }, res) => (
		res.send(
			toggleScenes(lifxClient, lifxConfig)([sceneName])
		)
	)
)

server.put(
	'/toggle-scene',
	({ body: { names } }, res) => (
		res.send(
			toggleScenes(lifxClient, lifxConfig)(names)
		)
	)
)

server.get(
	'/turn-off-group/:groupName',
	({ params: { groupName } }, res) => (
		res.send(
			turnOffGroups(lifxClient, lifxConfig)([groupName])
		)
	)
)

server.put(
	'/turn-off-group',
	({ body: { names } }, res) => (
		res.send(
			turnOffGroups(lifxClient, lifxConfig)(names)
		)
	)
)

startServer(server)

const DEVICE_DISCOVERY_INTERVAL = 600000 // 10 minutes

setInterval(
	() => discoverDevices(lifxClient, lifxConfig),
	DEVICE_DISCOVERY_INTERVAL
)
