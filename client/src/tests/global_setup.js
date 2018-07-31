const { refresh: refreshDB } = require('../../../db/scripts');
const yakbak = require('yakbak'); // eslint-disable-line
const http = require('http');

// this file doesn't run
console.log('globalsetup');

module.exports = async () => {
  const proxy = http.createServer(yakbak('http://localhost:4000', {
    dirname: `${__dirname}/../../../tests/tapes`,
  }));
  await proxy.listen(4567);
  await refreshDB();
};
