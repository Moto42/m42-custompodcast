const app = require('./server');
const request = require('supertest');

describe('/feed', () => {
  test('no feedID specified', (done) => {
    request(app)
      .get('/feeds')
      .expect('Content-Type', /json/)
      .expect(400, done)
  });
  test('test specified', (done) => {
    request(app)
      .get('/feeds/test')
      .expect('Content-Type', /xml/)
      .expect(200, done)
  });

});
