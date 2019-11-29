const mongo = require('mongodb').MongoClient;

const dataAPI = {};
dataAPI.id = {};

/**
 * Helper function, returns a live mongoDb Client and the feeds collection.
 * This is async.
 *
 * They are delivered in an object for an easy one-liner via object destrucutring.
 *    ie: ```const {client, collection} = await mongoCC();```
 *
 * Remember to call client.close when your done with it.
 * @return {Object} {client, collection};
 */
async function mongoCC(){
  const client = await mongo.connect(process.env.MONGOURI,{useNewUrlParser:true, useUnifiedTopology: true});
  const collection = await client.db('custompodcast').collection('feeds')
  return {client, collection}
}

/**
 * Handler for when no feedID is provided.
 *
 * returns 400 and a JSON  message
 *
 * @param  {Request}  req  Express Request object
 * @param  {Response} res  Express Response object
 * @param  {Function} next Function that will pass control to next handler in chain.
 * @return {void}          Return nothing. Either respond via res, or hand off via next();
 */
dataAPI.noID = function(req, res, next) {
  res.status(400).json({
    "message": "All data requests must specifiy a feed. ie: https://<URL>/data/(feed id here)",
  });
}

//TODO: dataAPI.get
/**
 * Handler for GET when no feedID is provided.
 *
 * returns 200 and a JSON array of all feedIDs found in the 'feeds' database.
 * if no feeds are present, the array is empty.
 *
 * @param  {Request}  req  Express Request object
 * @param  {Response} res  Express Response object
 * @param  {Function} next Function that will pass control to next handler in chain.
 * @return {void}          Return nothing. Either respond via res, or hand off via next();
 */
dataAPI.get = async function(req, res, next) {
  const {client, collection} = await mongoCC();
  const cursor = await collection.find({},{"feedID":true}).toArray();
  const feedIDs  =  cursor.map(f => f.feedID);
  res.status(200).json(feedIDs);
  client.close();
}

/**
 * Handler for GET when a feedID is provided.
 * Pulls the feedData from the 'feeds' collection of the mongoDB, and sends
 * the data back to the client as JSON.
 * ### If that feedID is not found in database
 * reply with 404, JSON message: `No feed found at /${feedID}`
 * ### feedID is found in database
 * respond 200, and RSS.
 * @param  {Request}  req  Express Request object
 * @param  {Response} res  Express Response object
 * @param  {Function} next Function that will pass control to next handler in chain.
 * @return {void}          Return nothing. Either respond via res, or hand off via next();
 */
dataAPI.id.get  = async function(req, res, next){
  const {client, collection} = await mongoCC();
  const feedData = await collection.findOne({"feedID":req.params.feedID});
  client.close();
  if(feedData === null){
    res.status(404).json({message:`No feed was found at /${req.params.feedID}`});
  }
  else {
    res.status(200).json(feedData);
  }
}

/**
 * Handler for POST request when feedID is provided.
 * Creates a new feedData object and adds it to the 'feeds' collection of the MongoDb.
 * If successfull, replies with status 201 and a message in JSON.
 * If a feed with that feedID already exists, replies with stauts 409 and JSON message.
 * @param  {Request}  req  Express Request object
 * @param  {Response} res  Express Response object
 * @param  {Function} next Function that will pass control to next handler in chain.
 * @return {void}          Return nothing. Either respond via res, or hand off via next();
 */
dataAPI.id.post  = async function(req, res, next){
  //sanity check the incoming JSON
  const feedData = req.body;
  feedData.feedID = req.params.feedID;

  const {client, collection} = await mongoCC();

  //make sure no feed already has this feedID
  const preExisting = await collection.find({"feedID":feedData.feedID},{_id:true}).count();

  if(preExisting > 0) {
    res.status(409).json({message : `A feed already exists at /${feedData.feedID}`});
  }
  else {
    //add it to the feeds collection
    await collection.insertOne(feedData);
    res.status(201).json({
      message : "Added new Feed",
      feedID: req.params.feedID,
    });
  }

  client.close();
}


/**
 * Handler for PUT request when feedID is provided.
 *
 * accepts a feedData object in the body of the request and updates the document
 * with the corrosponding feedID in the database with the new data.
 * If successfull, responds with 200 and JSON message.
 *
 * if feedID does not corrospond to anything in database, respond with 404 and JSON message
 * @param  {Request}  req  Express Request object
 * @param  {Response} res  Express Response object
 * @param  {Function} next Function that will pass control to next handler in chain.
 * @return {void}          Return nothing. Either respond via res, or hand off via next();
 */
dataAPI.id.put   = async function(req, res, next){

  const feedData = req.body;
  if(!feedData.feedID) feedData.feedID = req.params.feedID;
  const {client, collection} = await mongoCC();
  const dbObject = await collection.findOne({"feedID": req.params.feedID});
  if(dbObject === null) {
    res.status(404).json({message:`feedID ${feedData.feedID} not found to update`});
  } else {
    Object.assign(dbObject,feedData);
    collection.replaceOne({"feedID": req.params.feedID}, dbObject);
    res.status(200).json({message:`${req.params.feedID} deleted`})
  }
  client.close;

}

//TODO: dataAPI.id.delete
/**
 * Handler for DELETE request when feedID is provided.
 *
 * if a document is found in the 'feeds' collection with a feedID corrosponding to the one requested in the DELETE request, it is deleted from the collection.
 *
 * If successfull, responds with 200
 *
 * if no document with that feedID is found, responds with 404
 * @param  {Request}  req  Express Request object
 * @param  {Response} res  Express Response object
 * @param  {Function} next Function that will pass control to next handler in chain.
 * @return {void}          Return nothing. Either respond via res, or hand off via next();
 */
dataAPI.id.delete = async function(req, res, next){
  const {client, collection} = await mongoCC();
  const preExisting = await collection.find({"feedID":req.params.feedID},{_id:true}).count();
  if(preExisting < 1) {
    res.status(404).json({message:`No feed found to delete at /${req.params.feedID}`});
  } else {
    collection.findOneAndDelete({"feedID":req.params.feedID});
    res.status(200).json({message:'/${req.params.feedID} deleted'});
  }
  client.close();
}


module.exports = dataAPI;
