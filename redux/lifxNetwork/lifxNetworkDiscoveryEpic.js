const { fromEvent, merge, of } = require('rxjs')
const { map, switchMap } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const catchEpicError = require('$redux/utils/catchEpicError')

const {
	ADD_LIFX_NETWORK_CLIENT,
	addLifxNetworkLight,
	removeLifxNetworkLight,
	startNetworkListeners,
} = require('./actions')

const lifxNetworkDiscoveryEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(ADD_LIFX_NETWORK_CLIENT),
		switchMap(({ lifxNetworkClient }) => (
			merge(
				(
					fromEvent(
						lifxNetworkClient,
						'light-new',
					)
					.pipe(
						map(addLifxNetworkLight)
					)
				),
				(
					fromEvent(
						lifxNetworkClient,
						'light-offline',
					)
					.pipe(
						map(removeLifxNetworkLight)
					)
				),
				(
					fromEvent(
						lifxNetworkClient,
						'light-online',
					)
					.pipe(
						map(addLifxNetworkLight)
					)
				),
				of(startNetworkListeners()),
			)
		)),
		catchEpicError(),
	)
)

module.exports = lifxNetworkDiscoveryEpic
