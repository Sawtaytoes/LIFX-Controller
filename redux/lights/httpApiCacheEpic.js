const fs = require('fs')
const { bindNodeCallback, of } = require('rxjs')
const { combineEpics, ofType } = require('redux-observable')
const { ignoreElements, map, switchMap } = require('rxjs/operators')
// const { safeImport } = require('@ghadyani-framework/base')
const { stateSelector } = require('@ghadyani-framework/redux-utils')

const { httpApiLightsSelector } = require('./selectors')

const {
	ADD_HTTP_API_LIGHTS,
	addHttpApiLights,
} = require('./actions')

const safeImport = (
	(filePath, defaultValue) => (
		fs
		.existsSync(
			filePath
			.replace(
				/^(\$)/,
				'.',
			)
		)
		? require(filePath)
		: defaultValue
	)
)

const loadFromCacheEpic = (
	() => (
		of(
			safeImport(
				'$cache/lights.json',
				[],
			)
		)
		.pipe(
			map(addHttpApiLights),
		)
	)
)

const createWriteFileObservable = (
	bindNodeCallback(
		fs
		.writeFile
	)
)

const storeInCacheEpic = (
	(action$, state$) => (
		action$
		.pipe(
			ofType(ADD_HTTP_API_LIGHTS),
			switchMap(() => (
				stateSelector({
					selector: httpApiLightsSelector,
					state$,
				})
			)),
			map(JSON.stringify),
			switchMap(lightsJson => (
				createWriteFileObservable(
					'.cache/lights.json',
					lightsJson,
				)
			)),
			ignoreElements(),
		)
	)
)

const httpApiCacheEpic = (
	combineEpics(
		loadFromCacheEpic,
		storeInCacheEpic,
	)
)

module.exports = httpApiCacheEpic
