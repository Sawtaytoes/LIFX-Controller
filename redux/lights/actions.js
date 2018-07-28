const ADD_GROUP = 'CHANNELS::ADD_GROUP'
const ADD_LIGHT = 'CHANNELS::ADD_LIGHT'
const ADD_SCENE = 'CHANNELS::ADD_SCENE'

const addGroup = ({
	lightIds,
	namespace,
}) => ({
	lightIds,
	namespace,
	type: ADD_LIGHT,
})

const addLight = ({
	light,
}) => ({
	light,
	namespace: light.id,
	type: ADD_GROUP,
})

const addScene = ({
	namespace,
	scene,
}) => ({
	namespace,
	scene,
	type: ADD_SCENE,
})

module.exports = {
	ADD_GROUP,
	ADD_LIGHT,
	ADD_SCENE,
	addGroup,
	addLight,
	addScene,
}
