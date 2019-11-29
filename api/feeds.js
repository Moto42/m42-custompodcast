/** feeds.js
 * feeds.js handles requests for individual RSS feeds.
 * It will get the information on the requested feed, assemble the XML
 * data, and send the response.
 */

const mongo = require('mongodb').MongoClient;
const FeedData = require('./objects/FeedData')

/**
 * container for the functions handling requests that do not specifiy
 * a feedID.
 * @type {Object}
 */
const feeds = {};

/**
 * handler for GET requests that do not specifiy a feedID
 * @param  {HTTP Request}   req  Request from the client.
 * @param  {HTTP Response}  res  Response object
 * @param  {Function}       next function that will hand control to the next middle-ware in the chain.
 * @return {void}           return nothing, either send a response, or hand off via next
 */
feeds.get = function (req, res, next) {
  res.status(400).json({
    "message": "All feed requests must specifiy a feed. ie: https://<URL>/feeds/(feed id here)"
  });
}


/**
* container for function handling requests that specifiy a feedID
* @type {Object}
*/
feeds.id = {};

/**
 * hander for GET requests for a specific feedID.
 * If the feedID is valid, an XML document of the requested RSS feed is assembled and sent in the response.
 * @param  {HTTP Request}   req  Request from the client.
 * @param  {HTTP Response}  res  Response object
 * @param  {Function}       next function that will hand control to the next middle-ware in the chain.
 * @return {void}           return nothing, either send a response, or hand off via next
 */
feeds.id.get = async function(req, res, next) {
  const client = await mongo.connect(process.env.MONGOURI,{useNewUrlParser:true, useUnifiedTopology: true});
  const collection = await client.db('custompodcast').collection('feeds')

  const response = await collection.findOne({feedID:req.params.feedID});
  if(response === null) {
    res.status(404).json({
      message: `No feed found at /${req.params.feedID}`,
    });
    return;
  } else {
    //shove response into a FeedData
    const data = new FeedData(response);
    res.status(200).type('application/xml').send(data.xml);
  }


  client.close()

}

module.exports = feeds;
