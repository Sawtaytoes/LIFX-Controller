# LIFX Controller

Allows toggling lights by scenes using the HTTP API. This allows Logitech POP buttons to act as 6-function, instead of 3-function, devices. A single button-press can now both turn on and turn off a scene or group depending on if lights are on or off in the scene.


## Setup

### Configuration Customization

#### Config Settings
Default configs are `config-settings.js`. Here's an example of what defaults might look like:

```js
env: 'production',                            // Can be 'development' or 'production'.

//- Server
protocol: 'http',                             // Using `https` requires valid certificates.
hostname: '0.0.0.0',                          // Can be 0.0.0.0 for binding to all ports.
port: 3000,                                   // Port of webserver.
// proxyPort: 3001,                           // Optional. Will be `port + 1` if not defined.
```

To override these configs, either setup Node env vars such as: `NODE_ENV`, `PROTOCOL`, `HOSTNAME`, `PORT`, etc or create a `./server/configs/config.js` file and have it return an object with overrides like so:

```js
module.exports = {
	env: 'development',
	protocol: 'https',
	port: 443,
}
```


## Web Server Setup

### Development: Local
```shell
npm start
npm run api
```

OR

```shell
bash local.sh
```

OR

```shell
node index.js
node api.js
```

### Production: Hosted VPS
[Using PM2](http://pm2.keymetrics.io/)

#### Start the Server
Start a single server for testing:

```shell
bash server.sh
```

Start a cluster of `3` servers for load balancing in production:

```shell
bash server.sh 3
```

The number `3` can be replaced with any number. The default is `0`: equal to the number of CPU cores.

#### Update from Git and Restart
```shell
bash update.sh
```

If you update the update.sh file, make sure to run `git pull` prior to running the update script.

#### Stop the Server
```shell
bash stop-server.sh
```

### Create SSL Cert
Make sure to run this command to upgrade pip before starting:

```shell
pip install --upgrade pip
```

Optionally, you can upgrade Let's Encrypt:

```shell
cd /usr/share/letsencrypt/
git pull
```

_Replace `SERVER_NAME` with the website address._

```shell
service nginx stop

/usr/share/letsencrypt/letsencrypt-auto certonly \
-a standalone \
-d www.SERVER_NAME \
-d SERVER_NAME \
--server https://acme-v01.api.letsencrypt.org/directory

service nginx start
```

Or try this experimental approach:

```shell
/usr/share/letsencrypt/letsencrypt-auto certonly \
-a nginx \
-d www.SERVER_NAME \
-d SERVER_NAME \
--server https://acme-v01.api.letsencrypt.org/directory
```

When running the Let's Encrypt with, it requires installing the NGINX plugin:

```shell
cd /usr/share/letsencrypt/
~/.local/share/letsencrypt/bin/pip install -U letsencrypt-nginx
```

Let's Encrypt allows renewing using:

```shell
/usr/share/letsencrypt/letsencrypt-auto renew
```

### Create & Update Dev SSL Certs
> For ServiceWorker compatibility, update or use these certs along with `https` in `network-protocol`.

Using [ZeroSSL](https://zerossl.com/free-ssl):

- Account ID is 2400598
- Files are located in `conf/`

### Linting
Install packages globally for Sublime Text's `SublimeLinter-contrib-eslint` plugin.

```shell
npm i -g babel-eslint
```
