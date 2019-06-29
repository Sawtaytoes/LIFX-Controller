const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { combineLatest } = require('rxjs')
const { configurationSetSelector } = require('@redux-observable-backend/node/redux/configurations/selectors')
const { ignoreElements, switchMap, tap } = require('rxjs/operators')
const { ofType } = require('redux-observable')
const { stateSelector } = require('@redux-observable-backend/redux-utils')

const { START_LIFX_NETWORK_LISTENERS } = require('./actions')
const { lifxNetworkClientSelector } = require('./selectors')

const initializeLifxNetworkClientEpic = (
	action$,
	state$,
) => (
	action$
	.pipe(
		ofType(START_LIFX_NETWORK_LISTENERS),
		switchMap(() => (
			combineLatest(
				stateSelector({
					selector: configurationSetSelector,
					state$,
				}),
				stateSelector({
					selector: lifxNetworkClientSelector,
					state$,
				}),
			)
			.pipe(
				tap(([
					{ lifxLanClient = {} },
					lifxNetworkClient,
				]) => {
					lifxNetworkClient
					.init(lifxLanClient)
				})
			)
		)),
		catchEpicError(),
		ignoreElements(),
	)
)

module.exports = initializeLifxNetworkClientEpic
