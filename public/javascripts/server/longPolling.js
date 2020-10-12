const _ = require('lodash');
const chatRoom = require('./chatroom');
const LONG_POLLING_TIMEOUT = 1000;

function pushDataToClient(key, longpoll) {
  var contentKey = chatRoom.getContentKey();

  if (key !== contentKey) {
    var connectors = chatRoom.getConnectors();
    var messages = chatRoom.getMessages();

    longpoll.publish(
      '/v2/datas',
      {
        code: 200,
        data: {connectors: connectors, messages: messages, key: contentKey},
      }
    );
  }
}

function setupLongPollingRoute(app) {
  var longpoll = require("express-longpoll")(app);
  var key = '';
  var intervalId;

  longpoll.create("/v2/datas", function(req, res, next) {
    key = _.get(req.query, 'key', '');
    pushDataToClient(key, longpoll);
    next();
  });

  longpoll.create('/v2/unsubscribe', function(req, res, next) {
    intervalId && clearInterval(intervalId);
    next();
  });

  intervalId = setInterval(function() {
    pushDataToClient(key, longpoll);
  }, LONG_POLLING_TIMEOUT);
}

module.exports = setupLongPollingRoute;
