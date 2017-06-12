// Setup directories
const base = global.baseDir

const api = `${base}api/`
const server = `${base}server/`

const middleware = `${api}middleware/`

const configs = `${server}configs/`
const services = `${server}services/`

module.exports = {
	api,
	base,
	configs,
	middleware,
	server,
	services,
}
