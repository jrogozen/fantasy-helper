const ULID = require('ulid');

function setRequestId(app) {
  app.use((req, res, next) => {
    const id = ULID.ulid();

    req.id = id;
    next();
  });
}

module.exports = setRequestId;
