const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const addGroupsEpic = require('./addGroupsEpic')
// const groupsCountEpic = require('./groupsCountEpic')
const groupsListReducer = require('./groupsListReducer')
const lightGroupsListReducer = require('./lightGroupsListReducer')
const requestsEpic = require('./requestsEpic')
const toggleGroupEpic = require('./toggleGroupEpic')

const groupsEpic = (
	combineEpics(
		addGroupsEpic,
		// groupsCountEpic,
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
