const checkExpire = require('../database/queries/cb/pwd_token_expire');

module.exports = (dbConnection, token) =>
  new Promise((resolve, reject) => {
    checkExpire(dbConnection, token, (error, result) => {
      if (error) {
        console.log('error from checkExpire ', error);
        reject(error);
      } else {
        resolve(result.rows[0].exists);
      }
    });
  });
