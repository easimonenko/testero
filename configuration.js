'use strict;'

/**
 * Configuration.
 */

const config = require('config')

/**
 * @typedef {Object} Configuration
 * @property {number} port
 * @property {string} mode
 * @property {[string]} modules
 * @property {Object} mongodb
 * @property {string} mongodb.name
 * @property {string} mongodb.host
 * @property {number} mongodb.port
 * @property {Object} neo4j
 * @property {string} neo4j.name
 * @property {string} neo4j.host
 * @property {number} neo4j.port
 * @property {string} neo4j.user
 * @property {string} neo4j.password
 */

module.exports.getConfiguration = function() {
  /**
   * @type {Configuration} cfg
   */
  const cfg = {}

  cfg.port = config.port
  cfg.mode = config.mode

  cfg.neo4j = {}
  cfg.neo4j.host = config.neo4j.host
  cfg.neo4j.port = config.neo4j.port
  cfg.neo4j.name = config.neo4j.name
  cfg.neo4j.user = config.neo4j.user
  cfg.neo4j.password = config.neo4j.password

  cfg.mongodb = {}
  cfg.mongodb.host = config.mongodb.host
  cfg.mongodb.port = config.mongodb.port
  cfg.mongodb.name = config.mongodb.name

  return cfg
}
