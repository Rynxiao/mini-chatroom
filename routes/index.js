const express = require('express');
const router = express.Router();
const chatRoom = require('../public/javascripts/chatroom');
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

router.get('/friends', function(req, res) {
  const list = chatRoom.getConnectors();
  res.json({ code: 200, data: list })
});

router.get('/messages', function(req, res) {
  const list = chatRoom.getMessages();
  res.json({ code: 200, data: list })
});

router.get('/send', function(req, res) {
  const connector = _.get(req.query, 'name', '');
  const content = _.get(req.query, 'content', '');
  chatRoom.receive({ connector: connector, content: content });
  res.json({ code: 200, data: null });
});

module.exports = router;
