const dataAPI   = require('./index');
const httpMocks = require('node-mocks-http');
mongo = require('mongodb').MongoClient;

const mockData  = {
  "doners": [
    "https://www.fakeaddy.com/feed"
  ],
  "title": "test podcast",
  "link": "https://www.fakeaddy.com",
  "description": "podcast description",
  "imgUrl": "https://www.fakeaddy.com/img.jpg",
  "explicit": false,
  "owner_name": "fake name",
  "owner_email": "fake@email.com",
  "category": "Technology",
  "items": [
    {
      "episodeNumber": 1,
      "title": "test 1",
      "description": "test description 1",
      "url": "https://www.fakeaddy.com/cast1.mp3",
      "pubDate":"Thu, 21 Dec 2016 16:01:07 +0000",
      "length": "11"
    },
    {
      "episodeNumber": 2,
      "title": "test 2",
      "description": "test description 2",
      "url": "https://www.fakeaddy.com/cast2.mp3",
      "pubDate":"Thu, 21 Dec 2016 16:01:07 +0000",
      "length": "22"
    },
    {
      "episodeNumber": 3,
      "title": "test 3",
      "description": "test description 3",
      "url": "https://www.fakeaddy.com/cast3.mp3",
      "pubDate":"Thu, 21 Dec 2016 16:01:07 +0000",
      "length": "33"
    }
  ]
}
async function mongoCC() {
  const client = await mongo.connect(process.env.MONGOURI,{useNewUrlParser:true, useUnifiedTopology: true});
  const collection = await client.db('custompodcast').collection('feeds')
  return {client, collection};
}

const testFeedID = 'APITEST'+Math.round(Math.random()*100);

beforeAll(() => {
  require('dotenv').config();
});

test('dataAPI.noID handler', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'get',
    },null
  );
  await dataAPI.noID(req, res);
  expect(res.statusCode).toBe(400);
  expect(res._isJSON()).toBeTruthy();
})

test('POST', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'post',
    params: {feedID: testFeedID},
    body: mockData,
    },null
  );
  await dataAPI.id.post(req, res);
  expect(res.statusCode).toBe(201);
  const {client, collection} = await mongoCC();
  const exists = await collection.find({feedID:testFeedID},{_id:true}).count();
  expect(exists).toBe(1);
  client.close();
});

test('POST to preExisting feedID', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'post',
    params: {feedID: testFeedID},
    body: mockData,
    },null
  );
  await dataAPI.id.post(req, res);
  expect(res.statusCode).toBe(409);
  const {client, collection} = await mongoCC();
  const exists = await collection.find({feedID:testFeedID},{_id:true}).count();
  expect(exists).toBe(1);
  client.close();
});

test('GET', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'get',
    params: {feedID: testFeedID},
    },null
  );
  await dataAPI.id.get(req, res);
  expect(res.statusCode).toBe(200);
  expect(res._isJSON()).toBeTruthy();
  expect(res._getJSONData().feedID).toBe(testFeedID);
});

test('GET nonexistant feed', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'get',
    params: {feedID: 'APITESTFAIL'},
    },null
  );
  await dataAPI.id.get(req, res);
  expect(res.statusCode).toBe(404);
  expect(res._isJSON()).toBeTruthy();
});

test('GET no feedID', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'get',
    },null
  );
  await dataAPI.get(req, res);
  expect(res.statusCode).toBe(200);
  expect(res._isJSON()).toBeTruthy();
})

test('PUT', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'put',
    params: {feedID: testFeedID},
    body  : {description: 'altered description'}
    },null
  );
  await dataAPI.id.put(req, res);
  expect(res.statusCode).toBe(200);
  expect(res._isJSON()).toBeTruthy();
  const {client, collection} = await mongoCC();
  const dbData  = await collection.findOne({"feedID":testFeedID});
  expect(dbData.description).toBe('altered description');
  expect(dbData.title).toBe('test podcast');

  client.close();
});

test('PUT nonexistant feed', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'PUT',
    params: {feedID: 'APITESTFAIL'},
    },null
  );
  await dataAPI.id.put(req, res);
  expect(res.statusCode).toBe(404);
  expect(res._isJSON()).toBeTruthy();
});

test('DELETE', async () =>{
  const {req, res} = httpMocks.createMocks(
    {
    method: 'DELETE',
    params: {feedID: testFeedID},
    },null
  );
  await dataAPI.id.delete(req, res);
  expect(res.statusCode).toBe(200);
  const {client, collection} = await mongoCC();
  const exists = await collection.find({feedID:testFeedID},{_id:true}).count();
  expect(exists).toBe(0);
  client.close();
});

test('DELETE nonexistant feed', async () => {
  const {req, res} = httpMocks.createMocks(
    {
    method: 'DELETE',
    params: {feedID: 'APITESTFAIL'},
    },null
  );
  await dataAPI.id.delete(req, res);
  expect(res.statusCode).toBe(404);
});

afterAll( async ()=>{
  const {client, collection} = await mongoCC();
  collection.deleteOne({"feedID":testFeedID});
  client.close();
})
