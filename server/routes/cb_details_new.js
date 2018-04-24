const router = require('express').Router();
const cbDetailsNew = require('../database/queries/cb/cb_details_new');
const Joi = require('joi');
const { validate } = require('../shared/middleware');

const schemas = {
  body: {
    orgName: Joi.string()
      .regex(/[^\w\s\d]+/, { name: 'alphanumeric', invert: true })
      .min(1)
      .required(),

    email: Joi.string()
      .email()
      .required(),

    genre: Joi.string()
      .required(),
  },
};


router.post('/', validate(schemas), (req, res, next) => {
  cbDetailsNew(
    req.app.get('client:psql'),
    req.auth.cb_id,
    req.body.orgName,
    req.body.genre,
    req.body.email,
    req.body.uploadedFileCloudinaryUrl
  )
    .then(details => res.send({ result: details }))
    .catch(next);
});

module.exports = router;
