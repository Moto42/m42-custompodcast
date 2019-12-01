/** endpoint for getting an object representing an arbitrary rss feed
 * Frontends may need to pull RSS data from podcasts that have not set their CORS headers correctly.
 * The whole point of a podcast RSS is for other APPs to use the data, why do so many no set their headers?
 *
 * Query parameters: (ie: <endpoint>?parameter=_____)
 * - rssurl : --required--; the url of the RSS feed to be parsed.
 * - raw : if true, the RSS XML will not be parsed, but passed directly to the client with proper CORS headers.
 */


const FeedData = require('../objects/FeedData');

const rssData = {};

rssData.get = function(req, res, next){
  res.status(501).send('That ain\'t done yet y\'all.\ncome back later.')
}

module.exports = rssData;
