// server.js
// where your node app starts

// init project
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const podcastApi = require('./api/entryPoint')

//Setting cors
app.use((req,res,next) => {
  res.set('Access-Control-Allow-Origin','*');
  next();
});

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
app.use(bodyParser.json());
app.use(podcastApi);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;
