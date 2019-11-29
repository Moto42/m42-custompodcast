require('dotenv').config();
const feeds     = require('./feeds');
const httpMocks = require('node-mocks-http');


describe('No feedID specified', () => {
  const {req, res} = httpMocks.createMocks();
  feeds.get(req,res);
  test('responds with 400', () => {
    expect(res.statusCode).toBe(400);
  });
  test('responds with JSON', () => {
    expect(res._isJSON()).toBeTruthy();
  });
});


describe('GET', () => {
  describe('valid feedID specified',  () => {
    test('response status 200', async () => {
      const {req, res} = httpMocks.createMocks({params:{feedID:'test'}});
      await feeds.id.get(req,res);
      expect(res.statusCode).toBe(200);
    });
    test('Responds with XML', async () => {
      const {req, res} = httpMocks.createMocks({params:{feedID:'test'}});
      await feeds.id.get(req,res);
      expect(res.getHeader('Content-Type')).toBe('application/xml');
    });
  });
  describe('Invalid feedID', () => {
  const {req, res} = httpMocks.createMocks({params:{feedID:'FAIL'}});
  feeds.id.get(req,res);
  test('responds with 404', () => {
    expect(res.statusCode).toBe(404);
  });
  test('responds with JSON', () => {
    expect(res._isJSON()).toBeTruthy();
  });
});
});
