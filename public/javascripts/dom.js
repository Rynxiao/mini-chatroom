window.ChatroomDOM = (function (Request, NTF, $) {
  var friendsEle = document.getElementById('friends');
  var messagesEle = document.getElementById('messages');
  var connectButton = document.querySelector('.connect-button');
  var connectorEle = document.getElementById('connector');
  var sendBtn = document.getElementById('sendBtn');
  var sendInput = document.getElementById('sendInput');
  var $buttonsEle = $('#buttons');

  var connector = '';
  var selectedType = NTF.NOTIFICATION_MAP.SSE;

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
        '<span class="sender">' + message.connector + '</span>' +
        '<span class="sender-content">' + message.content + '' + '</span>' +
        '</li>';

      if (isSelf) {
        tpl = '<li class="right">' +
          '<span class="sender-content">' + message.content + '' + '</span>' +
          '<span class="sender">yourself</span>' +
          '</li>'
      }

      messageList += tpl;
    })

    messagesEle.innerHTML = messageList;
  }

  function scrollIntoView() {
    var messageEles = messagesEle.children;
    var lastEle = messageEles[messageEles.length - 1];

    if (lastEle) {
      lastEle.scrollIntoView();
    }
  }

  function renderData(res) {
    var data = res.data;
    renderFriends(data.connectors);
    renderMessages(data.messages, connector);
    scrollIntoView();
  }

  function renderAfterLogout() {
    connectorEle.textContent = '';
    connectButton.textContent = CONNECT_BUTTON_TEXT;
    connector = '';
  }

  function renderAfterRegister() {
    connectorEle.textContent = connector;
    connectButton.textContent = LOGOUT_TEXT;
  }

  function logout() {
    if (selectedType === NTF.NOTIFICATION_MAP.WEBSOCKET) {
      NTF.unsubscribe();
    } else {
      Request.logout(connector).then(function () {
        renderAfterLogout();
        NTF.unsubscribe();
      });
    }
  }

  function register() {
    connector = window.prompt(INPUT_CONNECT_NAME_TEXT);
    if (selectedType === NTF.NOTIFICATION_MAP.WEBSOCKET) {
      NTF.subscribe(NTF.NOTIFICATION_MAP.WEBSOCKET, connector);
    } else {
      Request.register(connector).then(function () {
        renderAfterRegister();
        NTF.subscribe(selectedType);
      });
    }
  }

  function loginOrOut() {
    if (connector) {
      logout();
    } else {
      register();
    }
  }

  function sendMessage() {
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

    if (selectedType === NTF.NOTIFICATION_MAP.WEBSOCKET) {
      NTF.send({ connector, content: inputValue });
    } else {
      Request.send(connector, inputValue)
    }
  }

  connectButton.addEventListener('click', loginOrOut);
  sendBtn.addEventListener('click', sendMessage);

  $buttonsEle.on('click', function(event) {
    var $target = $(event.target);
    var type = $target.data('type');
    $target.removeClass('active').addClass('active');
    $target.siblings('button').removeClass('active');

    console.log(type);

    if (type) {
      selectedType = type;
      loginOrOut();
    }
  });

  document.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e && e.keyCode === 13) {
      sendMessage();
    }
  })

  return {
    renderData,
    renderAfterRegister,
    renderAfterLogout,
  }
})(ChatRequest, ChatNotification, jQuery);
