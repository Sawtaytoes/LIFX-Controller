const ADD_GROUP = 'GROUPS::ADD_GROUP'
const TOGGLE_GROUP = 'GROUPS::TOGGLE_GROUP'

const addGroup = ({
	lightId,
	group,
	namespace,
}) => ({
	lightId,
	group,
	namespace,
	type: ADD_GROUP,
})

const toggleGroup = ({
	groupName,
}) => ({
	groupName,
	type: TOGGLE_GROUP,
})

module.exports = {
	ADD_GROUP,
	addGroup,
	TOGGLE_GROUP,
	toggleGroup,
}
