const { map } = require('rxjs/operators')

const getLifxLights = require('./utils/getLifxLights')
const { addLight } = require('./actions')

const networkDiscoveryEpic = (
	() => (
		getLifxLights()
		.pipe(
			map(light => ({
				network: light,
			})),
			map(addLight),
		)
	)
)

module.exports = networkDiscoveryEpic
