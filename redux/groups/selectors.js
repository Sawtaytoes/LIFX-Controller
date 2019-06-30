const selectLightIds = (
	{ groups },
	{ groupName },
) => (
	groups
	.lightIdsGroupList
	.get(groupName)
)

module.exports = {
	selectLightIds,
}
