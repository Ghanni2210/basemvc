const crypto = require('crypto');

class  Crypto {

  encrypt(algorithm, secret, text) => {
    let cipher = crypto.createCipher(algorithm, secret);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(algorithm, secret, text) => {
    let decipher = crypto.createDecipher(algorithm, secret);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}

module.exports = Crypto;
