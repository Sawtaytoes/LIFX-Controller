const fs = require('fs')
const { bindNodeCallback, of } = require('rxjs')
const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { combineEpics, ofType } = require('redux-observable')
const { ignoreElements, map, switchMap } = require('rxjs/operators')
const { safeImport } = require('@redux-observable-backend/core')

const { selectHttpApiLights } = require('./selectors')

const {
	ADD_HTTP_API_LIGHTS,
	addHttpApiLights,
} = require('./actions')

const loadFromCacheEpic = () => (
	of(
		safeImport({
			defaultValue: [],
			filePath: '$cache/lights.json',
		})
	)
	.pipe(
		map(addHttpApiLights),
		catchEpicError(),
	)
)

const storeInCacheEpic = (
	action$,
	state$,
) => (
	action$
	.pipe(
		ofType(ADD_HTTP_API_LIGHTS),
		map(() => state$.value),
		map(selectHttpApiLights()),
		map(JSON.stringify),
		switchMap(lightsJson => (
			bindNodeCallback(
				fs
				.writeFile
			)(
				'.cache/lights.json',
				lightsJson,
			)
		)),
		catchEpicError(),
		ignoreElements(),
	)
)

const httpApiCacheEpic = (
	combineEpics(
		loadFromCacheEpic,
		storeInCacheEpic,
	)
)

module.exports = httpApiCacheEpic
