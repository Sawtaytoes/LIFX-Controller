# HTTP LIFX LAN Controller

Allows toggling lights by scenes using the HTTP API. This allows Logitech POP buttons to act as 6-function, instead of 3-function, devices. A single button-press can now both turn on and turn off a scene or group depending on if lights are on or off in the scene.

## Example Usage

### Toggle or switch to a LIFX Scene
```
[YOUR_SERVER_ADDRESS]/toggle-scene/Bright Living Room
```

### Toggle or switch to a LIFX Group
```
[YOUR_SERVER_ADDRESS]/toggle-group/Living Room
```


## How to Run

### Start server
```shell
npm start
```

### Run with reload on file save
```shell
npm run api-mon
```

### Run with the Node.js debugger
```shell
npm run api-debug
```


## Setup

### Configuration Customization

#### Config Settings
Default configs are `config-settings.js`. Here's an example of what defaults might look like:

```js
module.exports = {
	env: 'production',                            // Can be 'development' or 'production'.

	//- Server
	protocol: 'http',                             // Using `https` requires valid certificates.
	hostname: '0.0.0.0',                          // Can be 0.0.0.0 for binding to all ports.
	port: 3000,                                   // Port of webserver.
	// proxyPort: 3001,                           // Optional. Will be `port + 1` if not defined.

	apiToken: '',                                   // API key from your LIFX Cloud account: https://cloud.lifx.com/settings
}
```

> *NOTE:* `apiToken` is required to cache groups and scenes from LIFX's HTTP API.

#### Override Default Config

To override these configs, create a `./server/configs/config.js` file and have it return an object with overrides like so:

```js
module.exports = {
	env: 'development',
	protocol: 'https',
	port: 443,
}
```

You can also set these env vars:

- `NODE_ENV`,
- `PROTOCOL`,
- `HOSTNAME`,
- `PORT`
- `API_TOKEN`


# Web Server Setup
Using [PM2](http://pm2.keymetrics.io/)

> *NOTE:* These can be run on any Linux device such as a Raspberry Pi

## Start the Server
Start a single server for testing:

```shell
bash server.sh
```

Start a cluster of `3` servers for load balancing in production:

```shell
bash server.sh 3
```

The number `3` can be replaced with any number. The default is `0`: equal to the number of CPU cores.

## Update from Git and Restart
```shell
bash update.sh
```

If you update the update.sh file, make sure to run `git pull` prior to running the update script.

## Stop the Server
```shell
bash stop-server.sh
```


# Create & Update Dev SSL Certs
Using [ZeroSSL](https://zerossl.com/free-ssl)

> These certs allow you to use HTTPS in Node.js without having to proxy to a secured NGINX or Apache server.

Files will reside in `conf/`:

- account-key.txt
- domain-crt.txt
- domain-csr.txt
- key.pem

### Linting
Install packages globally for Sublime Text's `SublimeLinter-contrib-eslint` plugin.

```shell
npm i -g babel-eslint
```
