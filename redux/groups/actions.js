const ADD_GROUP = 'GROUPS::ADD_GROUP'
const TOGGLE_GROUP = 'GROUPS::TOGGLE_GROUP'
const TOGGLE_GROUPS = 'GROUPS::TOGGLE_GROUPS'
const TURN_OFF_GROUP = 'GROUPS::TURN_OFF_GROUP'
const TURN_OFF_GROUPS = 'GROUPS::TURN_OFF_GROUPS'

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

const turnOffGroup = (
	groupName,
) => ({
	groupName,
	type: TURN_OFF_GROUP,
})

const turnOffGroups = (
	groupNames,
) => ({
	groupNames,
	type: TURN_OFF_GROUPS,
})

module.exports = {
	ADD_GROUP,
	addGroup,
	TOGGLE_GROUP,
	TOGGLE_GROUPS,
	toggleGroup,
	toggleGroups,
	TURN_OFF_GROUP,
	TURN_OFF_GROUPS,
	turnOffGroup,
	turnOffGroups,
}
