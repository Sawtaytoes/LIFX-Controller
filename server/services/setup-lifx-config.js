const fetch = require('node-fetch')
const fs = require('fs')

const dir = require(`${global.baseDir}/global-dirs`)
const config = require(`${dir.configs}config-settings`)
const logger = require(`${dir.api}/logger`)

const API_GET_LIGHTS = 'https://api.lifx.com/v1/lights'
const API_GET_SCENES = 'https://api.lifx.com/v1/scenes'

const FILE_ENCODING_SCHEME = 'utf8'
const CACHE_FILENAME = {
	LIGHTS: `${dir.cache}lights.json`,
	SCENES: `${dir.cache}scenes.json`,
}

const lights = new Map()
const groups = new Map()
const scenes = new Map()

const convertSelectorToId = selector => selector.replace('id:', '')

const setLight = light => {
	const { id, label } = light

	lights.set(label, light)
	lights.set(id, light)

	setLightGroup(light)
}

const setLightGroup = light => {
	const { group = {} } = light
	const { id, name } = group

	const storedGroup = groups.get(id, group) || Object.assign({}, group, { lights: [] })

	storedGroup.lights.push(light)

	groups.set(id, storedGroup)
	groups.set(name, storedGroup)
}

const setScene = scene => {
	const { name, uuid } = scene

	scene.lights = (
		scene.states
		.map(state => lights.get(convertSelectorToId(state.selector)))
	)

	scene.states = (
		scene.states
		.map(state => Object.assign(state, { id: convertSelectorToId(state.selector) }))
	)

	scenes.set(name, scene)
	scenes.set(uuid, scene)
}

const headers = {
	Authorization: `Basic ${config.getApiKey()}`
}
const handleResponse = response => response.json()

const clearLightsInGroups = jsonData => {
	Array.from(groups.values())
	.map(group => {
		group.lights = []
		return group
	})

	return jsonData
}

const storeJsonDataInCache = fileName => jsonData => {
	fs.writeFile(
		fileName,
		JSON.stringify(jsonData),
		FILE_ENCODING_SCHEME,
		err => err && console.error(err)
	)

	return jsonData
}

const storeJsonDataInMemory = action => jsonData => jsonData.forEach(action)

const clear = () => {
	lights.clear()
	groups.clear()
	scenes.clear()
}

const init = () => {
	fetch(API_GET_LIGHTS, { headers })
	.then(handleResponse)
	.then(storeJsonDataInCache(CACHE_FILENAME.LIGHTS))
	.then(clearLightsInGroups)
	.then(storeJsonDataInMemory(setLight))

	.then(() => fetch(API_GET_SCENES, { headers }))
	.then(handleResponse)
	.then(storeJsonDataInCache(CACHE_FILENAME.SCENES))
	.then(storeJsonDataInMemory(setScene))

	.catch(err => logger(`Error: ${err}`))
}

const update = init

if (!fs.existsSync(dir.cache)) {
	fs.mkdirSync(dir.cache);
}

const loadJsonDataFromCache = fileName => action => (
	fs.existsSync(fileName) && storeJsonDataInMemory(action)(
		JSON.parse(
			fs.readFileSync(fileName, FILE_ENCODING_SCHEME)
		)
	)
)

loadJsonDataFromCache(CACHE_FILENAME.LIGHTS)(setLight)
loadJsonDataFromCache(CACHE_FILENAME.SCENES)(setScene)

module.exports = {
	clear,
	groups,
	init,
	lights,
	scenes,
	update,
}
