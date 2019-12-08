const _ = require("lodash");
const jwt = require("jsonwebtoken");

module.exports = {
  extractToken,
  generateToken,
  isURLIgnored,
  verifyToken
};

function generateToken({ payload, secret, expiresIn }) {
  return jwt.sign(payload, secret, {
    expiresIn
  });
}

function extractToken(req) {
  const tokenHeaders = ["x-access-token", "authorization", "token", "auth"];

  let token = undefined;

  _.map(tokenHeaders, tokeHeader => {
    const keyTokenInReq = _.findKey(req, tokeHeader);

    if (keyTokenInReq) {
      token = req[keyTokenInReq][tokeHeader];
    }
  });

  return token ? token : false;
}

function verifyToken({ token, secret }) {
  return jwt.verify(token, secret);
}

function isURLIgnored(req, ignoreRoutes) {
  const kreq = _.findKey(req, "url");
  const { url } = req[kreq];

  for (let route of ignoreRoutes) {
    if (_.includes(route.url, url)) return false;
  }

  return true;
}
