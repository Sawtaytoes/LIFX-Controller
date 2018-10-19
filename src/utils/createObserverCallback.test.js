const test = require('ava')

const createObserverCallback = require('./create-observer-callback')

test('Initialization', t => {
	t.is(
		typeof createObserverCallback(),
		'object'
	)

	const {
		addObserver,
		triggerObservable
	} = createObserverCallback()

	t.is(
		typeof addObserver,
		'function'
	)
	t.is(
		typeof triggerObservable,
		'function'
	)
})

test.cb('Triggering a Single Observable', t => {
	const {
		addObserver,
		triggerObservable
	} = createObserverCallback()

	addObserver(t.end)
	triggerObservable()
})

test('Triggering Multiple Observables', t => {
	t.plan(2)

	const {
		addObserver,
		triggerObservable
	} = createObserverCallback()

	const callback1 = () => t.pass('Callback 1 Triggered')
	const callback2 = () => t.pass('Callback 2 Triggered')

	addObserver(callback1)
	addObserver(callback2)
	triggerObservable()
})

test.cb('Passing a Value into the Callback', t => {
	const {
		addObserver,
		triggerObservable
	} = createObserverCallback()

	const expectedValue = 'Test Value'

	const callback = value => {
		t.is(value, expectedValue)
		t.end()
	}

	addObserver(callback)
	triggerObservable(expectedValue)
})

test('Passing a Value into Multiple Callbacks', t => {
	t.plan(2)

	const {
		addObserver,
		triggerObservable
	} = createObserverCallback()

	const expectedValue = 'Test Value'

	const callback1 = value => {
		t.is(value, expectedValue)
	}

	const callback2 = value => {
		t.is(value, expectedValue)
	}

	addObserver(callback1)
	addObserver(callback2)
	triggerObservable(expectedValue)
})
