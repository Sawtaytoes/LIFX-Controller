const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const addGroupsEpic = require('./addGroupsEpic')
const groupsListReducer = require('./groupsListReducer')
const lightGroupsListReducer = require('./lightGroupsListReducer')
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
		lightGroupsList: lightGroupsListReducer,
	})
)

module.exports = {
	groupsEpic,
	groupsReducer,
}
