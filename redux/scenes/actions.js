const ADD_HTTP_API_SCENES = 'SCENES::ADD_HTTP_API_SCENES'
const ADD_SCENE = 'SCENES::ADD_SCENE'
const TOGGLE_SCENE = 'SCENES::TOGGLE_SCENE'
const TOGGLE_SCENES = 'SCENES::TOGGLE_SCENES'

const addHttpApiScenes = (
	scenes,
) => ({
	scenes,
	type: ADD_HTTP_API_SCENES,
})

const addScene = ({
	namespace,
	scene,
}) => ({
	namespace,
	scene,
	type: ADD_SCENE,
})

const toggleScene = (
	sceneName,
) => ({
	sceneName,
	type: TOGGLE_SCENE,
})

const toggleScenes = (
	sceneNames,
) => ({
	sceneNames,
	type: TOGGLE_SCENES,
})

module.exports = {
	ADD_HTTP_API_SCENES,
	ADD_SCENE,
	addHttpApiScenes,
	addScene,
	TOGGLE_SCENE,
	TOGGLE_SCENES,
	toggleScene,
	toggleScenes,
}
