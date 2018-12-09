// const Lifx  = require('node-lifx-lan');

// Lifx
// .discover()
// .then(devicesList => {
// 	console.log(devicesList)
// })

const LifxClient = require('node-lifx').Client

console.log('start')
const lifxClient = new LifxClient()

lifxClient.on('light-new', console.log)
lifxClient.update = console.log
lifxClient.init()
