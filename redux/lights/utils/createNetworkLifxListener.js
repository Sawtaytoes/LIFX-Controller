const nodeLifx = require('node-lifx')
const { fromEvent, ReplaySubject } = require('rxjs')

const LifxClient = nodeLifx.Client
const lifxClient = new LifxClient()

const networkLifxListener$ = new ReplaySubject()

const createNetworkLifxListener = (
	options => {
		fromEvent(
			lifxClient,
			'light-new',
		)
		.subscribe(
			networkLifxListener$
		)

		lifxClient
		.init(options)

		return networkLifxListener$
	}
)

module.exports = createNetworkLifxListener
