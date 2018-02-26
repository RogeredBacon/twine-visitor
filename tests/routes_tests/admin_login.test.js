const test = require('tape');
const request = require('supertest');
const app = require('../../react-backend/app');
const jwt = require('jsonwebtoken');

test('POST /api/admin/login | password match database hash', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const successPayload = {
    password: 'James',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.equal(res.body.success, true);
      t.end();
    });
});

test('POST /api/admin/login | no password match for database hash', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const failurePayload = {
    password: 'Zenith',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failurePayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.notEqual(res.body.success, false);
      t.end();
    });
});
