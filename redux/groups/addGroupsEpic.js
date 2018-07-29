const { filter, map } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const { ADD_LIGHT } = require('$redux/lights/actions')
const { addGroup } = require('./actions')

const addGroupsEpic = (
	action$ => (
		action$
		.pipe(
			ofType(ADD_LIGHT),
			filter(({ httpApi }) => (
				httpApi
			)),
			map(({
				httpApi,
				namespace,
			}) => ({
				group: httpApi.group,
				lightId: namespace,
				namespace: httpApi.group.name,
			})),
			map(addGroup),
		)
	)
)

module.exports = addGroupsEpic
