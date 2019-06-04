const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const addGroupsEpic = require('./addGroupsEpic')
const groupsListReducer = require('./groupsListReducer')
const lightIdsGroupListReducer = require('./lightIdsGroupListReducer')
const requestsEpic = require('./requestsEpic')
const toggleGroupEpic = require('./toggleGroupEpic')
const toggleGroupsEpic = require('./toggleGroupsEpic')
const turnOffGroupEpic = require('./turnOffGroupEpic')
const turnOffGroupsEpic = require('./turnOffGroupsEpic')

const groupsEpic = (
	combineEpics(
		addGroupsEpic,
		requestsEpic,
		toggleGroupEpic,
		toggleGroupsEpic,
		turnOffGroupEpic,
		turnOffGroupsEpic,
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
