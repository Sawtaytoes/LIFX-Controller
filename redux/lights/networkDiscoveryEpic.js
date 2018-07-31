const chalk = require('chalk')
const { buffer, debounceTime, map, tap } = require('rxjs/operators')

const createNetworkLifxListener = require('./utils/createNetworkLifxListener')
const { addNetworkLights } = require('./actions')

const networkLifxListener$ = (
	createNetworkLifxListener()
)

const networkDiscoveryEpic = (
	() => (
		networkLifxListener$
		.pipe(
			buffer(
				networkLifxListener$
				.pipe(
					debounceTime(500),
				)
			),
			tap(lights => {
				console
				.info(
					chalk
					.yellow(
						lights
						.length
					)
				)
			}),
			map(addNetworkLights),
		)
	)
)

module.exports = networkDiscoveryEpic
