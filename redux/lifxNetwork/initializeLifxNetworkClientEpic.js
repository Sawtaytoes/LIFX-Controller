const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { configurations } = require('@redux-observable-backend/node')
const { ignoreElements, map, tap } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const { selectLifxNetworkClient } = require('./selectors')
const { START_LIFX_NETWORK_LISTENERS } = require('./actions')

const initializeLifxNetworkClientEpic = (
	action$,
	state$,
) => (
	action$
	.pipe(
		ofType(START_LIFX_NETWORK_LISTENERS),
		map(() => state$.value),
		map(state => ({
			configurationSet: (
				configurations
				.selectors
				.selectConfigurationSet()(
					state,
				)
			),
			lifxNetworkClient: (
				selectLifxNetworkClient()(
					state,
				)
			),
		})),
		tap(({
			configurationSet,
			lifxNetworkClient,
		}) => {
			lifxNetworkClient
			.init(
				configurationSet
				.lifxLanClient
			)
		}),
		catchEpicError(),
		ignoreElements(),
	)
)

module.exports = initializeLifxNetworkClientEpic
