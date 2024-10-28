const PayU = require('payu-websdk');

module.exports.payuClient = new PayU({
  key: process.env.PAYU_API_KEY,
  salt: process.env.PAYU_SALT_256BIT,
},'TEST');     // Possible value  = TEST/LIVE
