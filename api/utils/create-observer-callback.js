module.exports = () => {
	let callbacks = []

	const addObserver = callback => (
		callbacks
		.push(callback)
	)

	const triggerObservable = data => (
		callbacks
		.map(callback => callback(data))
	)

	return (
		Object.freeze({
			addObserver,
			triggerObservable,
		})
	)
}
