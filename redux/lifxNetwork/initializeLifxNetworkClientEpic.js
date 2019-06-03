const { combineLatest } = require('rxjs')
const { configurationSetSelector } = require('@ghadyani-framework/node/redux/configurations/selectors')
const { ignoreElements, switchMap, tap } = require('rxjs/operators')
const { ofType } = require('redux-observable')
const { stateSelector } = require('@ghadyani-framework/redux-utils')

const catchEpicError = require('$redux/utils/catchEpicError')
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
					{ nodeLifxClient = {} },
					lifxNetworkClient,
				]) => {
					lifxNetworkClient
					.init(nodeLifxClient)
				})
			)
		)),
		catchEpicError(),
		ignoreElements(),
	)
)

module.exports = initializeLifxNetworkClientEpic
