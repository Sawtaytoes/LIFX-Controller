const selectHttpApiLights = () => ({
	lights,
}) => (
	lights
	.httpApiLightsList
)

const selectNetworkLight = ({
	lightId,
}) => ({
	lights,
}) => (
	lights
	.networkLightsList
	.find(({ id }) => (
		id === lightId
	))
)

const selectNetworkLights = () => ({
	lights,
}) => (
	lights
	.networkLightsList
)

module.exports = {
	selectHttpApiLights,
	selectNetworkLight,
	selectNetworkLights,
}
