const chalk = require('chalk')
const { catchError } = require('rxjs/operators')
const { EMPTY } = require('rxjs')

const catchEpicError = (
	returnValue = EMPTY,
) => (
	catchError(error => {
		console
		.error(
			chalk
			.redBright(
				error
			)
		)

		return returnValue
	})
)

module.exports = catchEpicError
