/** endpoint for getting an object representing an arbitrary rss feed
 * Frontends may need to pull RSS data from podcasts that have not set their CORS headers correctly.
 * The whole point of a podcast RSS is for other APPs to use the data, why do so many no set their headers?
 *
 * Query parameters: (ie: <endpoint>?parameter=_____)
 * - rssurl : --required--; the url of the RSS feed to be parsed.
 * - raw : if true, the RSS XML will not be parsed, but passed directly to the client with proper CORS headers.
 */

const FeedData = require('../objects/FeedData');
const fetch = require('node-fetch');

const rssData = {};

rssData.get = async function(req, res, next){
  res.set('Access-Control-Allow-Origin', '*');
  const {rssurl, raw} = req.query;
  if(! rssurl) {
    res.status(400).send("No RSS feed url specified");
  }
  //fetch the RSS XML
  const rssRequest = await fetch(rssurl);
  const contentType = rssRequest.headers.get('content-type')
  const status = rssRequest.status;
  if(status !== 200) {
    res.status(400).send(`Failed to GET RSS feed ${rssurl}. Request failed with status code ${status}`)
    return;
  }
  if(! /application\/rss\+xml/.test(contentType) ){
    rest.status(400).send(`Error: Conent type of requested url is not 'application/rss+xml,\nContent Type returned ${contentType}'`);
    return;
  }

  //Passing the raw RSS XML if requested
  if(raw === "true"){
    res.set('content-type', contentType);
    res.send(await rssRequest.text());
    return
  }

  // At this point we know:
  //  - Client requested a parsed  FeedData object
  //  - rssurl was most likely valid.



  res.send('yup');
}

module.exports = rssData;
