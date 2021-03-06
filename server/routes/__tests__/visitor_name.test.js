const test = require('tape');
const request = require('supertest');
const createApp = require('../../app');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../../../config');
const { refresh: refreshDB } = require('../../../db/scripts');

const config = getConfig(process.env.NODE_ENV);

test('POST /api/user/name-from-scan | viable & registered hash', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  await refreshDB();
  const token = jwt.sign({ email: 'jvalentine@umbrella.corp' }, secret);

  const successPayload = {
    hash: '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .set('authorization', token)
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.equal(res.body.fullname, 'james bond');
      dbConnection.end(t.end);
    });
});

test('POST /api/user/name-from-scan | non-viable hash ', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  await refreshDB();
  const token = jwt.sign({ email: 'jvalentine@umbrella.corp' }, secret);

  const failPayload = {
    hash: 'Im fairly sure, though not positive, that this is not a hash',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .set('authorization', token)
    .send(failPayload)
    .expect(400)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null, error: 'Invalid hash' });
      dbConnection.end(t.end);
    });
});

test('POST /api/user/name-from-scan | user/hash not registered ', async (t) => {
  const app = createApp(config);
  const dbConnection = app.get('client:psql');
  const secret = app.get('cfg').session.standard_jwt_secret;

  await refreshDB();
  const token = jwt.sign({ email: 'jvalentine@umbrella.corp' }, secret);

  const failPayload = {
    hash: '5e6188b3f09e0d58acfbe4171284dd10b69ea8a78189f7bb8c7d6fa983557492',
  };
  request(app)
    .post('/api/user/name-from-scan')
    .set('authorization', token)
    .send(failPayload)
    .expect(401)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notOk(err, err || 'Passes supertest expect criteria');
      t.deepEqual(res.body, { result: null, error: 'No user found' });
      dbConnection.end(t.end);
    });
});
