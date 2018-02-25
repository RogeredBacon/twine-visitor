const test = require('tape');
const request = require('supertest');
const app = require('../../react-backend/app');

test('POST /api/admin/login | password match database hash', (t) => {
  const successPayload = {
    password: 'James',
  };
  request(app)
    .post('/api/visit/check')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(res => res.json())
    .end((err, res) => {
      t.ok(res.success, 'Password correctly matched database hash');
      t.end();
    });
});

test('POST /api/admin/login | no password match for database hash', (t) => {
  const failurePayload = {
    password: 'Zenith',
  };
  request(app)
    .post('/api/visit/check')
    .send(failurePayload)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(res => res.json())
    .end((err, res) => {
      t.ok(!res.success, 'Password did not match the database hash');
      t.end();
    });
});
