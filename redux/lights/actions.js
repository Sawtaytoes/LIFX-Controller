const ADD_GROUP = 'LIGHTS::ADD_GROUP'
const ADD_LIGHT = 'LIGHTS::ADD_LIGHT'
const ADD_SCENE = 'LIGHTS::ADD_SCENE'

const addGroup = ({
	lightIds,
	namespace,
}) => ({
	lightIds,
	namespace,
	type: ADD_GROUP,
})

const addLight = ({
	httpApi,
	network,
}) => ({
	httpApi,
	namespace: (
		httpApi
		.id
		|| (
			network
			.id
		)
	),
	network,
	type: ADD_LIGHT,
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
