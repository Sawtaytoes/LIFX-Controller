const { map } = require('rxjs/operators')

const getLifxLights = require('./utils/getLifxLights')
const { addLight } = require('./actions')

const networkDiscoveryEpic = (
	() => (
		getLifxLights()
		.pipe(
			map(addLight),
		)
	)
)

module.exports = networkDiscoveryEpic
