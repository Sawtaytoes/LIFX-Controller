const httpApiLightsSelector = (
	({ lights }) => (
		lights
		.httpApiLightsList
	)
)

const networkLightSelector = (
	({ lights }, { lightId }) => (
		lights
		.networkLightsList
		.find(({ id }) => (
			id === lightId
		))
	)
)

const networkLightsSelector = (
	({ lights }) => (
		lights
		.networkLightsList
	)
)

module.exports = {
	httpApiLightsSelector,
	networkLightSelector,
	networkLightsSelector,
}
