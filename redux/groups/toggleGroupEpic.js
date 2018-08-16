const { ignoreElements, map, tap } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const { TOGGLE_GROUP } = require('./actions')

const toggleGroupEpic = (
	action$ => (
		action$
		.pipe(
			ofType(TOGGLE_GROUP),
			map(({ groupName }) => ({
				groupName,
			})),
			tap(console.log),
			ignoreElements(),
		)
	)
)

module.exports = toggleGroupEpic
