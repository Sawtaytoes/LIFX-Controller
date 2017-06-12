// Global Dir Hack
global.baseDir = `${__dirname}/`

// Load Config settings
const dir = require(`${global.baseDir}/global-dirs`)
const setupServer = require(`${dir.server}setup-server`)
const startServer = require(`${dir.server}start-server`)

// Load Middleware
const toggleScene = require(`${dir.middleware}toggle-scene`)

const serverSettings = setupServer()

serverSettings.get('/', (req, res) => res.end('You no be hearz.'))

serverSettings.get('/toggle-scene/:sceneName', (req, res) => res.send(toggleScene(req.params.sceneName)))

startServer(serverSettings)
