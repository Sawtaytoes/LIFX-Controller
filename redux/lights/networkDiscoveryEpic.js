const { ignoreElements, tap } = require('rxjs/operators')

const networkDiscoveryEpic = (
	action$ => (
		action$
		.pipe(
			tap(console.log),
			ignoreElements(),
		)
	)
)

module.exports = networkDiscoveryEpic
