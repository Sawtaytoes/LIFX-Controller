const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')

const dir = require(`${global.baseDir}directories`)
const config = require(`${dir.configs}config`)

const server = express()

server
.use(compression())
.use(helmet())
.use(cors({ origin: config.getSafeUrl(config.getServerUrl), optionsSuccessStatus: 200 }))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))

.disable('x-powered-by')

module.exports = () => server
