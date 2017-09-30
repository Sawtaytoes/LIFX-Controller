# Configuration
Default config values are found in [server/configs/configSettings.js](server/configs/configSettings.js).

Create a custom `config.js` in `server/configs/` to change 


## Example
```js
module.exports = {
	apiToken: 'a324de5512bb3d8f1b142f9bf830fbd2d6b0e32c542a023a6fa298dd3b25c740',
	env: 'development',
	port: 4000,
}
```


# Config Values


## `apiToken`
LIFX API Auth Token. This value is required to cache groups and scenes from LIFX's HTTP API.


### Environment Variables
`API_TOKEN`

### Example
```
apiToken: 'a324de5512bb3d8f1b142f9bf830fbd2d6b0e32c542a023a6fa298dd3b25c740',
```


## `env`
Node.js environment. This value can be either `'development'` or `'production'`.

### Environment Variables
`NODE_ENV`

### Example
```
env: 'development',
```


## `hostname`
A string representation of the hostname, domain name, or IP address of the webserver. Usually this is left at either '0.0.0.0' or localhost.

### Environment Variables
`HOSTNAME`

### Example
```
hostname: '0.0.0.0',
```


## `port`
A number representing the port for the webserver to listen.

### Environment Variables
`PORT`

### Example
```
port: 36001,
```


## `protocol`
The protocol used to connect to the webserver. Using `https` requires an SSL certificate in the `cert/` directory.

### Environment Variables
`PROTOCOL`

### Example
```
protocol: 'http',
```
