const {
	ADD_GROUP,
} = require('$redux/groups/actions')

const {
	ADD_LIFX_NETWORK_LIGHT,
	REMOVE_LIFX_NETWORK_LIGHT,
} = require('$redux/lifxNetwork/actions')

const {
	ADD_SCENE,
} = require('$redux/scenes/actions')

module.exports = [
	ADD_GROUP,
	ADD_LIFX_NETWORK_LIGHT,
	ADD_SCENE,
	REMOVE_LIFX_NETWORK_LIGHT,
]
