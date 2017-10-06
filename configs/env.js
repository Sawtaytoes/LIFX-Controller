const processEnvConfigValues = {
	NODE_ENV: 'env',
	PROTOCOL: 'protocol',
	HOSTNAME: 'hostname',
	PORT: 'port',
	API_TOKEN: 'apiToken',
}

const createConfigObject = (acc, { key, value }) => ({
	...acc,
	[key]: value
})

const getProcessEnvValue = key => ({
	key: processEnvConfigValues[key],
	value: process.env[key],
})

const hasValue = ({ value }) => typeof value !== 'undefined'

module.exports = (
	Object
	.keys(processEnvConfigValues)
	.map(getProcessEnvValue)
	.filter(hasValue)
	.reduce(createConfigObject, {})
)
