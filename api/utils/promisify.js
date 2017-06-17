const spreadPromiseArgs = (promise, func) => (
	promise
	.then(args => Promise.all(args))
	.then(args => func.apply(promise, args))
)

const spreadablePromise = promise => ({
	catch: promise.catch.bind(promise),
	then: func => (
		promise.then(spreadPromiseArgs(promise, func))
	),
})

const handleCallback = (resolve, reject) => (
	(err, ...callbackArgs) => (
		err
		? reject(err)
		: resolve(callbackArgs)
	)
)

const promisify = functionWithCallback => (...functionArgs) => (
	spreadablePromise(
		new Promise(
			(resolve, reject) => (
				functionWithCallback(
					...functionArgs,
					handleCallback(resolve, reject)
				)
			)
		)
	)
)

module.exports = promisify
