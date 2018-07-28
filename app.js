const { of } = require('rxjs')
const { tap } = require('rxjs/operators')

require('./')

const {
	createConfigurationSet,
	createReduxStore,
	runTasks,
} = require('@ghadyani-framework/node')

const {
	createHttpServers,
	createWebSocketServers,
} = require('@ghadyani-framework/websocket')

const {
	rootEpic,
	rootReducers,
} = require('$redux')

of(
	createReduxStore({
		additionalEpics: rootEpic,
		additionalReducers: rootReducers,
	})
)
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
