const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const postmark = require('postmark');
const pg = require('pg');
const enforce = require('express-sslify');
const logger = require('./logger');
const { notFound, errorHandler, validationError } = require('./shared/middleware');
const { PRODUCTION } = require('../config/environments');


module.exports = (cfg) => {
  // Non-global import required because of client-connections
  // that are created in module scope of routes
  const apiRoutes = require('./router'); // eslint-disable-line global-require

  const postmarkClient = new postmark.Client(cfg.email.postmark_key);
  const psqlPool = new pg.Pool(cfg.psql);

  const app = express();

  app.set('cfg', cfg);
  app.set('client:postmark', postmarkClient);
  app.set('client:psql', psqlPool);

  if (cfg.env === PRODUCTION) {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }
  app.use(favicon(path.join(cfg.root, 'client', 'public', 'favicon.ico')));
  app.use(logger);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(cfg.root, 'client', 'build')));

  app.use('/api', apiRoutes);
  app.get('/*', express.static(path.join(cfg.root, 'client', 'build', 'index.html')));

  app.use(validationError);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
