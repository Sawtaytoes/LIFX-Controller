const ADD_GROUP = 'GROUPS::ADD_GROUP'
const TOGGLE_GROUP = 'GROUPS::TOGGLE_GROUP'
const TOGGLE_GROUPS = 'GROUPS::TOGGLE_GROUPS'

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

const toggleGroup = (
	groupName,
) => ({
	groupName,
	type: TOGGLE_GROUP,
})

const toggleGroups = (
	groupNames,
) => ({
	groupNames,
	type: TOGGLE_GROUPS,
})

module.exports = {
	ADD_GROUP,
	addGroup,
	TOGGLE_GROUP,
	TOGGLE_GROUPS,
	toggleGroup,
	toggleGroups,
}
