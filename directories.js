// Setup directories
const base = global.baseDir

const cache = `${base}.cache/`
const configs = `${base}configs/`
const src = `${base}src/`

const middleware = `${src}middleware/`
const server = `${src}server/`
const services = `${src}services/`
const utils = `${src}utils/`

module.exports = {
	base,
	cache,
	configs,
	middleware,
	server,
	services,
	utils,
}
