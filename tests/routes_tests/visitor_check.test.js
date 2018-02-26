const test = require('tape');
const request = require('supertest');
const app = require('../../react-backend/app');
const jwt = require('jsonwebtoken');

test('POST /api/visit/check | viable name & email & exists in database', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const successPayload = {
    formSender: 'James Bond',
    formEmail: 'hello@yahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.equal(res.text, 'true');
      t.end();
    });
});

test('POST /api/visit/check | viable name & email & not found in database', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const successPayload = {
    formSender: 'John The Ripper',
    formEmail: 'goodbye@yahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(successPayload)
    .expect(200)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.equal(res.text, 'false');
      t.end();
    });
});

test('POST /api/visit/check | bad name & viable email', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const failPayload = {
    formSender: 'addi7837***&&$$%$%',
    formEmail: 'hello@yahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failPayload)
    .expect(415)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.equal(res.text, 'name');
      t.end();
    });
});

test('POST /api/visit/check | viable name & bad email', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const failPayload = {
    formSender: 'James Bond',
    formEmail: 'helloyahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failPayload)
    .expect(415)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.equal(res.text, 'email');
      t.end();
    });
});

test('POST /api/visit/check | bad name & email', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const failPayload = {
    formSender: 'Jame77***"%s Bond',
    formEmail: 'helloyahoo.com',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failPayload)
    .expect(415)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.equal(res.text, 'emailname');
      t.end();
    });
});

test('POST /api/visit/check | no input test', (t) => {
  const token = jwt.sign({ email: 'jinglis12@googlemail.com' }, process.env.SECRET);

  const failPayload = {
    formSender: '',
    formEmail: '',
  };
  request(app)
    .post('/api/visit/check')
    .set('authorization', token)
    .send(failPayload)
    .expect(415)
    .expect('Content-Type', /text/)
    .end((err, res) => {
      t.equal(res.text, 'noinput');
      t.end();
    });
});
