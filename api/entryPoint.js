const entryPoint = require('express').Router();
const feeds      = require('./feeds');
const data       = require('./data');
const rssData    = require('./rssData');


entryPoint.route('/feeds')
  .get(feeds.get);

entryPoint.route('/feeds/:feedID')
  .get(feeds.id.get);


entryPoint.route('/data')
  .get(data.get);

entryPoint.route('/data/:feedID')
  .get(data.id.get)
  .post(data.id.post)
  .put(data.id.put)
  .delete(data.id.delete);

/** endpoint for getting an object representing an arbitrary rss feed
 * Frontends may need to pull RSS data from podcasts that have not set their CORS headers correctly.
 * The whole point of a podcast RSS is for other APPs to use the data, why do so many no set their headers?
 */
entryPoint.route('/rssdata')
  .get(rssData.get);

module.exports = entryPoint;
