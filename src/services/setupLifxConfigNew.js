const fetch = require('node-fetch')
const fs = require('fs')
const Rx = require('rxjs/Rx')

const dir = require(`${global.baseDir}directories`)
const config = require(`${dir.configs}configSettings`)
const createObserverCallback = require(`${dir.utils}create-observer-callback`)
const logger = require(`${dir.utils}logger`)

const { addObserver, triggerObservable } = createObserverCallback()

const LIFX_API_ADDRESS = 'https://api.lifx.com/v1/'
const API_GET_LIGHTS = `${LIFX_API_ADDRESS}lights`
const API_GET_SCENES = `${LIFX_API_ADDRESS}scenes`

const FILE_ENCODING_SCHEME = 'utf8'
const CACHE_FILENAME = {
	LIGHTS: `${dir.cache}lights.json`,
	SCENES: `${dir.cache}scenes.json`,
}

const headers = {
	'Accept-Encoding': 'gzip, deflate',
	Authorization: `Bearer ${config.getApiToken()}`,
}

const getJsonFromResponse = response => response.json()

const getLights = () => (
	Rx.Observable.fromPromise(
		fetch(API_GET_LIGHTS, { headers })
		.then(getJsonFromResponse)
	)
)

const handleJsonError = ({ error }) => logger.logError('Error: LIFX HTTP API =>', error)

const setLightById = light => {
	const { id, label } = light

	lights.set(label, light)
	lights.set(id, light)
}

const storeJsonDataInCache = fileName => jsonData => {
	fs.writeFile(
		fileName,
		JSON.stringify(jsonData),
		FILE_ENCODING_SCHEME,
		err => err && logger.logError(err)
	)

	return jsonData
}

const lights$ = (
	Rx.Observable
	.fromEventPattern(addObserver)
	.switchMap(getLights)
	.do(handleJsonError)
	.filter(({ error }) => !error)
	.do(storeJsonDataInCache(CACHE_FILENAME.LIGHTS))
	.map(lights => lights.map(setLightById))
)

lights$
.subscribe({ error: logger.logError })

module.exports = {
	init: triggerObservable,
	update: triggerObservable,
	lights$,
}
