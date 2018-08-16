const ADD_LIFX_NETWORK_CLIENT = 'LIFX_NETWORK::ADD_LIFX_NETWORK_CLIENT'
const ADD_LIFX_NETWORK_LIGHT = 'LIFX_NETWORK::ADD_LIFX_NETWORK_LIGHT'
const REMOVE_LIFX_NETWORK_LIGHT = 'LIFX_NETWORK::REMOVE_LIFX_NETWORK_LIGHT'
const START_LIFX_NETWORK_LISTENERS = 'LIFX_NETWORK::START_LIFX_NETWORK_LISTENERS'

const addLifxNetworkClient = (
	lifxNetworkClient,
) => ({
	lifxNetworkClient,
	type: ADD_LIFX_NETWORK_CLIENT,
})

const addLifxNetworkLight = (
	light,
) => ({
	light,
	type: ADD_LIFX_NETWORK_LIGHT,
})

const removeLifxNetworkLight = (
	light,
) => ({
	light,
	type: REMOVE_LIFX_NETWORK_LIGHT,
})

const startNetworkListeners = () => ({
	type: START_LIFX_NETWORK_LISTENERS,
})

module.exports = {
	ADD_LIFX_NETWORK_CLIENT,
	ADD_LIFX_NETWORK_LIGHT,
	addLifxNetworkClient,
	addLifxNetworkLight,
	REMOVE_LIFX_NETWORK_LIGHT,
	removeLifxNetworkLight,
	START_LIFX_NETWORK_LISTENERS,
	startNetworkListeners,
}
