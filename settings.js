'use strict;'

const mongodb = require('mongodb')
const neo4j = require('neo4j-driver')

const cfg = require('./configuration').getConfiguration()

/**
 * Connect to Neo4j server.
 */

const neo4jHost = cfg.neo4j.host || 'localhost'
const neo4jPort = cfg.neo4j.port || '7687'
const neo4jDBName = cfg.neo4j.name || 'testero-development'
const neo4jUser = cfg.neo4j.user
const neo4jPassword = cfg.neo4j.password
const neo4jDriver = neo4j.driver(
  'bolt://' + neo4jHost + ':' + neo4jPort,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
)
const neo4jSession = neo4jDriver.session({
  database: neo4jDBName
})

/**
 * @typedef {Object} Settings
 * @property {mongodb.Db} settings.mongoDBConnection
 * @property {neo4j.Session} settings.neo4jSession
 */

/**
 * @type {Settings} settings
 */
const settings = {}
settings.neo4jSession = neo4jSession

/**
 * Connect to MongoDB server.
 */

const mongoHost = cfg.mongodb.host || 'localhost'
const mongoPort = cfg.mongodb.port || '27017'
const mongoDBName = cfg.mongodb.name || 'testero-development'
const mongoUrl = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoDBName
const mongoParams = { useNewUrlParser: true, useUnifiedTopology: true }

module.exports.getSettings = function() {
  return mongodb.MongoClient.connect(mongoUrl, mongoParams).then(client => {
    settings.mongoDBConnection = client.db(mongoDBName)
    return settings
  })
}
