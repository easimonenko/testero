# testero

## Installing

### Linux Debian/Ubuntu

Install Node.js and NPM from Ubuntu 18.04 repository:

`sudo apt install nodejs npm`

For Ubuntu before 18.04 see original instruction from <https://nodejs.org>.

Install Redis:

`sudo apt install redis-server`

Install MongoDB from Ubuntu 18.04 repository:

``` sh
sudo apt install mongodb
```

Install MongoDB (before 18.04):

Full instructions see on
[official site](https://docs.mongodb.com/master/tutorial/install-mongodb-on-ubuntu/).

``` sh
sudo apt install mongodb-org
```

Also will be installed `mongodb-org-server`, `mongodb-org-mongos`,
`mongodb-org-shell`, `mongodb-org-tools`.

Install Neo4j:

[See official documentation.](https://neo4j.com/docs/operations-manual/current/installation/linux/debian/)

Clone latest Testero:

`git clone https://github.com/severe-island/testero.git`

or:

`git clone https://github.com/easimonenko/testero.git`

Install packages:

``` sh
npm install
```

## Configuring

Edit configuration files:

- development mode: <../config/development.json>
- production mode: <../config/production.json>
- testing mode: <../config/testing.json>

For setting of port for web-server add parameter:

``` json
"port": 3000
```

For usege of MongoDB add following lines:

``` json
"mongodb": {
  "name": "testero-development",
  "port": 27017,
  "host": "localhost"
}
```

For usage of Neo4j add following lines:

``` json
"neo4j": {
  "name": "testero-development",
  "port": 7687,
  "host": "localhost",
  "user": "",
  "password": ""
}
```

Set configuration parameters as you need.

## Running

Run MongoDB:

``` sh
sudo systemctl start mongodb
```

Run Redis:

``` sh
sudo systemctl start redis-server
```

Run Neo4j:

``` sh
sudo systemctl start neo4j
```

Then

``` sh
npm start
```

Goto <http://localhost:3000>.

## Code testing

``` sh
npm test
```

``` sh
npm run coverage
```

---

(c) 2015, Severe Island Team; 2015 -- 2021, Evgeny Simonenko
