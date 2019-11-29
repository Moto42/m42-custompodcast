const entryPoint = require('express').Router();
const feeds      = require('./feeds');
const data       = require('./data');


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

module.exports = entryPoint;