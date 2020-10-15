const express = require('express');
const router = express.Router();
const chatRoom = require('../public/javascripts/server/chatroom');
const Event = require('../public/javascripts/server/event');
const _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mini Chat Room' });
});

router.get('/register', function(req, res) {
  const connector = _.get(req.query, 'name', '');
  chatRoom.onConnect(connector);
  res.json({ code: 200, data: null });
});

router.get('/logout', function(req, res) {
  const connector = _.get(req.query, 'name', '');
  chatRoom.onLeave(connector);
  res.json({ code: 200, data: null });
});

router.get('/datas', function(req, res) {
  const connectors = chatRoom.getConnectors();
  const messages = chatRoom.getMessages();
  res.json({ code: 200, data: { connectors: connectors, messages: messages } })
});

router.get('/send', function(req, res) {
  const connector = _.get(req.query, 'name', '');
  const content = _.get(req.query, 'content', '');
  chatRoom.receive({ connector: connector, content: content });
  Event.emit();
  res.json({ code: 200, data: null });
});

// router.get('/v2/datas', function(req, res) {
//   const key = _.get(req.query, 'key', '');
//   let contentKey = chatRoom.getContentKey();
//
//   while (key === contentKey) {
//     sleep.sleep(5);
//     contentKey = chatRoom.getContentKey();
//   }
//
//   const connectors = chatRoom.getConnectors();
//   const messages = chatRoom.getMessages();
//   res.json({
//     code: 200,
//     data: { connectors: connectors, messages: messages, key: contentKey },
//   });
// });

router.get('/sse', function(req, res) {
  const connectors = chatRoom.getConnectors();
  const messages = chatRoom.getMessages();
  const response = { code: 200, data: { connectors: connectors, messages: messages } };

  res.writeHead(200, {
    "Content-Type":"text/event-stream",
    "Cache-Control":"no-cache",
    "Connection":"keep-alive",
    "Access-Control-Allow-Origin": '*',
  });

  res.write("retry: 10000\n");
  res.write("data: " + JSON.stringify(response) + "\n\n");

  var unsubscribe = Event.subscribe(function() {
    const connectors = chatRoom.getConnectors();
    const messages = chatRoom.getMessages();
    const response = { code: 200, data: { connectors: connectors, messages: messages } };
    res.write("data: " + JSON.stringify(response) + "\n\n");
  });

  req.connection.addListener("close", function () {
    unsubscribe();
  }, false);
});

module.exports = router;
