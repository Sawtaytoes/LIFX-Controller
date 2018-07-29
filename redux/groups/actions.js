const ADD_GROUP = 'GROUPS::ADD_GROUP'

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

module.exports = {
	ADD_GROUP,
	addGroup,
}
