const selectLightIds = ({
	groupName,
}) => ({
	groups,
}) => (
	groups
	.lightIdsGroupList
	.get(groupName)
)

module.exports = {
	selectLightIds,
}
