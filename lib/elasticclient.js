
/**
 * Dependencies
 */

var request = require('request'),
    qs = require('querystring');

/**
 * ElasticSearch Client
 * @param  {String} server e.g 'http://localhost:9300'
 * @return {this}
 */
var ElasticSearch = function(server) {
  this.url = server;
  return this;
};

/**
 * Selects an index
 * @param  {String} index e.g 'twitter'
 * @return {Index}
 */
ElasticSearch.prototype.index = function(index) {
  return new Index(index, this);
};

/**
 * Search ElasticSearch Server
 * @param  {Object|String}   query   search terms
 * @param  {Function} callback (err, response, results)
 */
ElasticSearch.prototype.search = function(query, callback) {
  var uri = this.url + '/_search';
  if(typeof query == 'string') uri += '?q=' + qs.escape(query);
  request({
    uri: uri,
    json: (typeof query == 'string') ? true : query
  }, function(err, res, body) {
    if(err) return callback(err);
    return callback(null, body, body.hits.hits);
  });
};

/**
 * ElasticSearch Index Client
 * @param  {String} index
 * @param  {ElasticSearch} server
 * @return {this}
 */
var Index = function(index, server) {
  this.name = index;
  this._server = server;
  return this;
};

/**
 * Selects a type
 * @param  {String} type e.g 'tweet'
 * @return {Type}
 */
Index.prototype.type = function(type) {
  return new Type(type, this, this._server);
};

/**
 * Search Index
 * @param  {Object|String}   query    query terms
 * @param  {Function} callback (err, response, results)
 */
Index.prototype.search = function(query, callback) {
  var uri = this._server.url + '/' + this.name + '/_search';
  if(typeof query == 'string') uri += '?q=' + qs.escape(query);
  request({
    uri: uri,
    json: (typeof query == 'string') ? true : query
  }, function(err, res, body) {
    if(err) return callback(err);
    return callback(null, body, body.hits.hits);
  });
};

/**
 * ElasticSearch Type Client
 * @param  {String} type
 * @param  {Index} index
 * @param  {ElasticSearch} server
 * @return {this}
 */
var Type = function(type, index, server) {
  this.name = type;
  this._index = index;
  this._server = server;
  return this;
};

/**
 * Search Type
 * @param  {Object|String}   query    query terms
 * @param  {Function} callback (err, response, results)
 */
Type.prototype.search = function(query, callback) {
  var uri = this._server.url + '/' + this._index.name + '/' + this.name + '/_search';
  if(typeof query == 'string') uri += '?q=' + qs.escape(query);
  request({
    uri: uri,
    json: (typeof query == 'string') ? true : query
  }, function(err, res, body) {
    if(err) return callback(err);
    return callback(null, body, body.hits.hits);
  });
};

/**
 * Create a ElasticSeach Client
 * @param  {Number} port
 * @param  {String} host
 * @return {ElasticSearch}
 */
var createClient = function(port, host) {
  return new ElasticSearch('http://' + (host || 'localhost') + ':' + (port || 9200));
};

/**
 * Exports
 */

module.exports = createClient;
module.exports.ElasticSearch = ElasticSearch;
module.exports.createClient = createClient;
