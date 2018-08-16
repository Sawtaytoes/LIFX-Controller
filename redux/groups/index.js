const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const addGroupsEpic = require('./addGroupsEpic')
const groupsListReducer = require('./groupsListReducer')
const lightIdsGroupListReducer = require('./lightIdsGroupListReducer')
const requestsEpic = require('./requestsEpic')
const toggleGroupEpic = require('./toggleGroupEpic')

const groupsEpic = (
	combineEpics(
		addGroupsEpic,
		requestsEpic,
		toggleGroupEpic,
	)
)

const groupsReducer = (
	combineReducers({
		groupsList: groupsListReducer,
		lightIdsGroupList: lightIdsGroupListReducer,
	})
)

module.exports = {
	groupsEpic,
	groupsReducer,
}
