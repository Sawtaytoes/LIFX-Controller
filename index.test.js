try {
	require('./api.js')
} catch (err) {
	// Do Nothing
}
require('isomorphic-fetch')
const test = require('tape')

// Global Dir Hack
global.baseDir = `${__dirname}/`

// Load Config settings
const dir = require(`${global.baseDir}/global-dirs`)
const config = require(`${dir.configs}config-settings`)

// --------------------------------------------------------
// Globals
// --------------------------------------------------------

const urlRoot = `${config.getSafeUrl(config.getAPIServerUrl)}/`
const request = { headers: { 'Content-Type': 'application/json' } }

const userId = 0
const displayName = 'Samuel'
const username = `fakeUsername${Math.random()}`
const password = 'fakePassword'

const tweetId = 0
const content = 'I love pie!'

const responseWrapper = func => response => {
	func(response || {})
	return response
}

const cannotAccess = (t, method) => responseWrapper(message => (
	t.ok(message.includes(`Cannot ${method}`), `Received Error: ${message}`)
))

const shouldError = t => responseWrapper(({ error, message }) => (
	t.ok(error, `Received Error: ${message}`)
))

const shouldNotError = t => responseWrapper(({ error, message }) => (
	t.ok(!error, `Received Error: ${message}`)
))

const getUserId = t => responseWrapper(({ userId }) => (
	t.equal(typeof userId, 'number', `Received UserId: ${userId}`)
))


// --------------------------------------------------------
// Login
// --------------------------------------------------------

test('Login: No Data', t => {
	const method = 'POST'
	fetch(`${urlRoot}login`, Object.assign({}, request, { method }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Login: Username Only', t => {
	const method = 'POST'
	const body = JSON.stringify({ username })
	fetch(`${urlRoot}login`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Login: Password Only', t => {
	const method = 'POST'
	const body = JSON.stringify({ password })
	fetch(`${urlRoot}login`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Login: Username and Blank Password', t => {
	const method = 'POST'
	const body = JSON.stringify({ username, password: '' })
	fetch(`${urlRoot}login`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Login: Non-existent Username and Password', t => {
	const method = 'POST'
	const body = JSON.stringify({ username: 'asdfkljasdlfkj', password: 'asdfkljasdlfkj' })
	fetch(`${urlRoot}login`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Login: Username and Password', t => {
	const method = 'POST'
	const body = JSON.stringify({ username: 'sample', password: 'pass' })
	fetch(`${urlRoot}login`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldNotError(t))
	.then(getUserId(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})


// --------------------------------------------------------
// User
// --------------------------------------------------------

//- Get User

test('Get Users', t => {
	fetch(`${urlRoot}user`)
	.then(res => res.text())
	.then(shouldNotError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Get User: User ID', t => {
	fetch(`${urlRoot}user/${userId}`)
	.then(res => res.json())
	.then(shouldNotError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})


//- Register User

test('Register User: No Data', t => {
	const method = 'POST'
	fetch(`${urlRoot}user`, Object.assign({}, request, { method }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Register User: Username Only', t => {
	const method = 'POST'
	const body = JSON.stringify({ username })
	fetch(`${urlRoot}user`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Register User: Password Only', t => {
	const method = 'POST'
	const body = JSON.stringify({ password })
	fetch(`${urlRoot}user`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Register User: Username and Blank Password', t => {
	const method = 'POST'
	const body = JSON.stringify({ username, password: '' })
	fetch(`${urlRoot}user`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Register User: Username and Password', t => {
	const method = 'POST'
	const body = JSON.stringify({ username, password })
	fetch(`${urlRoot}user`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldNotError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})


//- Update User

test('Update User: No Data', t => {
	const method = 'PUT'
	fetch(`${urlRoot}user`, Object.assign({}, request, { method }))
	.then(res => res.text())
	.then(cannotAccess(t, method))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Update User: User ID Only', t => {
	const method = 'PUT'
	fetch(`${urlRoot}user/${userId}`, Object.assign({}, request, { method }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Update User: Display Name Only', t => {
	const method = 'PUT'
	const body = JSON.stringify({ displayName })
	fetch(`${urlRoot}user`, Object.assign({}, request, { method, body }))
	.then(res => res.text())
	.then(cannotAccess(t, method))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Update User: User ID and Blank Display Name', t => {
	const method = 'PUT'
	const body = JSON.stringify({ displayName: '' })
	fetch(`${urlRoot}user/${userId}`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Update User: User ID and Display Name', t => {
	const method = 'PUT'
	const body = JSON.stringify({ displayName })
	fetch(`${urlRoot}user/${userId}`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldNotError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})


// --------------------------------------------------------
// Tweet
// --------------------------------------------------------

//- Get Tweet

test('Get Tweets', t => {
	fetch(`${urlRoot}tweet`)
	.then(res => res.text())
	.then(shouldNotError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Get Tweet: Tweet ID', t => {
	fetch(`${urlRoot}tweet/${tweetId}`)
	.then(res => res.json())
	.then(shouldNotError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})


//- Update Tweet

test('Update Tweet: No Data', t => {
	const method = 'PUT'
	fetch(`${urlRoot}tweet`, Object.assign({}, request, { method }))
	.then(res => res.text())
	.then(cannotAccess(t, method))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Update Tweet: Tweet ID Only', t => {
	const method = 'PUT'
	fetch(`${urlRoot}tweet/${tweetId}`, Object.assign({}, request, { method }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Update Tweet: Content Only', t => {
	const method = 'PUT'
	const body = JSON.stringify({ content })
	fetch(`${urlRoot}tweet`, Object.assign({}, request, { method, body }))
	.then(res => res.text())
	.then(cannotAccess(t, method))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Update Tweet: Tweet ID and Blank Content', t => {
	const method = 'PUT'
	const body = JSON.stringify({ content: '' })
	fetch(`${urlRoot}tweet/${tweetId}`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Update Tweet: Tweet ID and Content', t => {
	const method = 'PUT'
	const body = JSON.stringify({ content })
	fetch(`${urlRoot}tweet/${tweetId}`, Object.assign({}, request, { method, body }))
	.then(res => res.json())
	.then(shouldNotError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})


// --------------------------------------------------------
// UserTweet
// --------------------------------------------------------

//- Post Tweet for User

test('Post Tweet: No Data', t => {
	const method = 'POST'
	fetch(`${urlRoot}tweet`, Object.assign({}, request, { method }))
	.then(res => res.text())
	.then(cannotAccess(t, method))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Post Tweet: Blank Content', t => {
	const method = 'POST'
	const body = JSON.stringify({ content: '' })
	fetch(`${urlRoot}user/${userId}/tweet`, Object.assign({}, request, {
		method,
		body,
	}))
	.then(res => res.json())
	.then(shouldError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})

test('Post Tweet: Content', t => {
	const method = 'POST'
	const body = JSON.stringify({ content })
	fetch(`${urlRoot}user/${userId}/tweet`, Object.assign({}, request, {
		method,
		body,
	}))
	.then(res => res.json())
	.then(shouldNotError(t))
	.catch(err => t.error(err))
	.then(() => t.end())
})
