const sceneSelector = (
	{ scenes },
	{ sceneName },
) => (
	scenes
	.scenesList
	.get(sceneName)
)

module.exports = {
	sceneSelector,
}
