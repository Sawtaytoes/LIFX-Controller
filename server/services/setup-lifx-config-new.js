const fetch = require('node-fetch')
const fs = require('fs')
const Rx = require('rxjs/Rx')

const dir = require(`${global.baseDir}/global-dirs`)
const config = require(`${dir.configs}config-settings`)
const logger = require(`${dir.utils}/logger`)

const LIFX_API_ADDRESS = 'https://api.lifx.com/v1/'
const API_GET_LIGHTS = `${LIFX_API_ADDRESS}lights`
const API_GET_SCENES = `${LIFX_API_ADDRESS}scenes`

const FILE_ENCODING_SCHEME = 'utf8'
const CACHE_FILENAME = {
	LIGHTS: `${dir.cache}lights.json`,
	SCENES: `${dir.cache}scenes.json`,
}

const getLights = () => (
	Rx.Observable.fromPromise(
		fetch(API_GET_LIGHTS, { headers })
		.then(getJsonFromResponse)
	)
)

const handleJsonError = ({ error }) => logger.logError('Error: LIFX HTTP API =>', error)

const lifxConfig = {
	init: observer => observer.next(getLights)
}

const setLightById = light => {
	const { id, label } = light

	lights.set(label, light)
	lights.set(id, light)
}

Rx.Observable
.create(lifxConfig.init)
.switchMap(getLights)
.do(handleJsonError)
.filter(({ error }) => !error)
.do(storeJsonDataInCache(CACHE_FILENAME.LIGHTS))
.map(lights => lights.map(setLightById))
