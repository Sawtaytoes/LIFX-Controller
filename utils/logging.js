const chalk = require('chalk')

const logError = (
	...errors
) => {
	if (errors.length === 2) {
		const [
			title,
			error,
		] = errors

		console
		.error(
			chalk
			.bgRed(
				title
			),
			chalk
			.redBright(
				error
			),
		)
	}
	else {
		console
		.error(
			chalk
			.redBright(
				...errors
			)
		)
	}

	return errors
}

const logInfo = (
	...infos
) => {
	console
	.info(...infos)

	return infos
}

module.exports = {
	logError,
	logInfo,
}
