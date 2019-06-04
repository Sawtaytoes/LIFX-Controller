const lightIdsSelector = (
	{ groups },
	{ groupName },
) => (
	groups
	.lightIdsGroupList
	.get(groupName)
)

module.exports = {
	lightIdsSelector,
}
