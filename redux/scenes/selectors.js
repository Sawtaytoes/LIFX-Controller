const selectScene = ({
	sceneName,
}) => ({
	scenes,
}) => (
	scenes
	.scenesList
	.get(sceneName)
)

module.exports = {
	selectScene,
}
