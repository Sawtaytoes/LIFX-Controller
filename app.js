// Include this import before other local imports.
require('@ghadyani-framework/setup-module-aliases')(__dirname)

const { applyMiddleware, createStore } = require('redux')
const { createActionLoggerMiddleware } = require('@ghadyani-framework/redux-utils')
const { createConfigurationSet, runTasks } = require('@ghadyani-framework/node')
const { createEpicMiddleware } = require('redux-observable')
const { of } = require('rxjs')
const { tap } = require('rxjs/operators')

require('./')

const {
	createHttpServers,
	createWebSocketServers,
} = require('@ghadyani-framework/websocket')

const {
	rootEpic,
	rootReducer,
} = require('$redux')

const actionLoggerMiddleware = (
	createActionLoggerMiddleware()
)

const epicMiddleware = createEpicMiddleware()

const middleware = (
	applyMiddleware(
		actionLoggerMiddleware,
		epicMiddleware
	)
)

const store = (
	createStore(
		rootReducer,
		middleware,
	)
)

epicMiddleware
.run(rootEpic)

of(store)
.pipe(
	tap(createConfigurationSet({})),
	tap(createHttpServers()),
	tap(createWebSocketServers()),
	tap(
		runTasks(
			'lint',
			'serve',
		)
	),
)
.subscribe()
