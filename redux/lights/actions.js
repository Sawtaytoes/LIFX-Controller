const ADD_HTTP_API_LIGHTS = 'LIGHTS::ADD_HTTP_API_LIGHTS'
const ADD_NETWORK_LIGHTS = 'LIGHTS::ADD_NETWORK_LIGHTS'
const REMOVE_NETWORK_LIGHT = 'LIGHTS::REMOVE_NETWORK_LIGHT'

const addHttpApiLights = (
	lights,
) => ({
	lights,
	type: ADD_HTTP_API_LIGHTS,
})

const addNetworkLights = (
	lights,
) => ({
	lights,
	type: ADD_NETWORK_LIGHTS,
})

const removeNetworkLight = ({
	light,
}) => ({
	light,
	type: REMOVE_NETWORK_LIGHT,
})

module.exports = {
	ADD_HTTP_API_LIGHTS,
	ADD_NETWORK_LIGHTS,
	addHttpApiLights,
	addNetworkLights,
	REMOVE_NETWORK_LIGHT,
	removeNetworkLight,
}
