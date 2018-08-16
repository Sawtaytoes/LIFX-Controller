const lifxNetworkClientSelector = (
	({ lifxNetwork }) => (
		lifxNetwork
		.lifxNetworkClient
	)
)

module.exports = {
	lifxNetworkClientSelector,
}
