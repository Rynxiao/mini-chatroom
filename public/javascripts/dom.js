window.ChatroomDOM = (function (Request, NTF) {
  var friendsEle = document.getElementById('friends');
  var messagesEle = document.getElementById('messages');
  var connectButton = document.querySelector('.connect-button');
  var connectorEle = document.getElementById('connector');
  var sendBtn = document.getElementById('sendBtn');
  var sendInput = document.getElementById('sendInput');
  var connector = '';

  var CONNECT_BUTTON_TEXT = 'Connect To Chat Room';
  var INPUT_CONNECT_NAME_TEXT = 'Please input connect name';
  var SING_NAME_TEXT = 'Sign your name first!!!';
  var WRITE_SOMETHING_TEXT = 'You must say something ~';
  var LOGOUT_TEXT = 'Log out';

  function renderFriends(friends) {
    var friendList = '';
    friends.forEach(function (friend) {
      friendList += '<li>' + friend + '</li>'
    });

    friendsEle.innerHTML = friendList;
  }

  function renderMessages(messages, connector) {
    var messageList = '';
    messages.forEach(function (message) {
      var isSelf = message.connector === connector;
      var tpl = '<li>' +
       '<span class="sender">'+ message.connector + '</span>' +
       '<span class="sender-content">'+ message.content +'' + '</span>' +
      '</li>';

      if (isSelf) {
        tpl = '<li class="right">' +
          '<span class="sender-content">'+ message.content +'' + '</span>' +
          '<span class="sender">yourself</span>' +
        '</li>'
      }

      messageList += tpl;
    })

    messagesEle.innerHTML = messageList;
  }

  function renderData(res) {
    var data = res.data;
    renderFriends(data.connectors);
    renderMessages(data.messages, connector);
  }

  connectButton.addEventListener('click', function() {
    if (connector) {
      Request.logout(connector).then(function() {
        connectorEle.textContent = '';
        connectButton.textContent = CONNECT_BUTTON_TEXT;
        connector = '';
        NTF.unsubscribe();
      });
    } else {
      connector = window.prompt(INPUT_CONNECT_NAME_TEXT);
      Request.register(connector).then(function() {
        connectorEle.textContent = connector;
        connectButton.textContent = LOGOUT_TEXT;
        NTF.subscribe(NTF.NOTIFICATION_MAP.LONG_POLLING, renderData);
      });
    }
  });

  sendBtn.addEventListener('click', function() {
    var inputValue = sendInput.value;
    if (!connector) {
      alert(SING_NAME_TEXT)
      return;
    }

    if (!inputValue) {
      alert(WRITE_SOMETHING_TEXT);
      return;
    }

    sendInput.value = '';
    Request.send(connector, inputValue)
  });
})(ChatRequest, ChatNotification);
