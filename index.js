#!/usr/bin/env node
require('better-module-alias')(__dirname)
require('$utils/createCacheDirectory')

module.exports = {
	actionsBlacklist: require('$redux/actionsBlacklist'),
	groups: require('$redux/groups').groups,
	lifxNetwork: require('$redux/lifxNetwork').lifxNetwork,
	lights: require('$redux/lights').lights,
	scenes: require('$redux/scenes').scenes,
}
