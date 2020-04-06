

const crypto = require('crypto');
const util = require('util');


function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new util.TextEncoder('utf-8').encode(message);

    // create hash object and hash the message
    const hasher = crypto.createHash('sha256');
    hasher.update(msgBuffer);

    // Convert to base64
    const hashStr = hasher.digest('base64');

    return hashStr;
}

module.exports = {
    sha256: sha256
};

