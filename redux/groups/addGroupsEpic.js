const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { map, mergeMap } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const { ADD_HTTP_API_LIGHTS } = require('$redux/lights/actions')
const { addGroup } = require('./actions')

const addGroupsEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(ADD_HTTP_API_LIGHTS),
		mergeMap(({ lights }) => (
			lights
		)),
		map(({ group, id }) => ({
			group: group,
			lightId: id,
			namespace: group.name,
		})),
		map(addGroup),
		catchEpicError(),
	)
)

module.exports = addGroupsEpic
