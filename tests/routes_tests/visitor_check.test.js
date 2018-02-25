const test = require('tape');
const request = require('supertest');
const app = require('../../react-backend/app');

test('POST /api/visit/check | viable name & email & exists in database', (t) => {
  const successPayload = {
    formSender: 'James Bond',
    formEmail: 'hello@yahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /text/)
    .expect(res => res.text())
    .end((err, res) => {
      t.ok(res === 'true', 'Name and Email are viable and found in database');
      t.end();
    });
});

test('POST /api/visit/check | viable name & email & not found in database', (t) => {
  const successPayload = {
    formSender: 'John The Ripper',
    formEmail: 'goodbye@yahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /text/)
    .expect(res => res.text())
    .end((err, res) => {
      t.ok(res === 'false', 'Name and Email are viable and not found in database');
      t.end();
    });
});

test('POST /api/visit/check | bad name & viable email', (t) => {
  const failPayload = {
    formSender: 'addi7837***&&$$%$%',
    formEmail: 'hello@yahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .send(failPayload)
    .expect(415)
    .expect('Content-Type', /text/)
    .expect(res => res.text())
    .end((err, res) => {
      t.ok(res === 'name', 'Name is not viable, Email is viable');
      t.end();
    });
});

test('POST /api/visit/check | viable name & bad email', (t) => {
  const failPayload = {
    formSender: 'James Bond',
    formEmail: 'helloyahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .send(failPayload)
    .expect(415)
    .expect('Content-Type', /text/)
    .expect(res => res.text())
    .end((err, res) => {
      t.ok(res === 'email', 'Name is viable, email is not viable');
      t.end();
    });
});

test('POST /api/visit/check | bad name & email', (t) => {
  const failPayload = {
    formSender: 'Jame77***"%s Bond',
    formEmail: 'helloyahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .send(failPayload)
    .expect(415)
    .expect('Content-Type', /text/)
    .expect(res => res.text())
    .end((err, res) => {
      t.ok(res === 'emailname', 'Name and email are not viable');
      t.end();
    });
});

test('POST /api/visit/check | no input test', (t) => {
  const failPayload = {
    formSender: '',
    formEmail: '',
  };
  request(app)
    .post('/api/visit/check')
    .send(failPayload)
    .expect(415)
    .expect('Content-Type', /text/)
    .expect(res => res.text())
    .end((err, res) => {
      t.ok(res === 'noinput', 'No input');
      t.end();
    });
});
