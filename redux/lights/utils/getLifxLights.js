const nodeLifx = require('node-lifx')
const { fromEvent, Observable } = require('rxjs')

const LifxClient = nodeLifx.Client
const lifxClient = new LifxClient()

const getLifxLights = (
	options => (
		Observable
		.create(observer => {
			fromEvent(
				lifxClient,
				'light-new',
			)
			.subscribe(observer)

			lifxClient
			.init(options)
		})
	)
)

module.exports = getLifxLights
