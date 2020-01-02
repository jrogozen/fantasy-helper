const functions = require('firebase-functions');
const app = require('./server/app');

exports.widgets = functions.https.onRequest(app);