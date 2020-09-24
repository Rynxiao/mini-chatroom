window.ChatroomDOM = (function () {
  var friendsEle = document.getElementById('friends');
  var messagesEle = document.getElementById('messages');

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
      var tpl = '<li>' + message.connector + ' says: ' + message.content + '</li>';

      if (isSelf) {
        tpl = '<li class="right">you say: ' + message.content + '</li>'
      }

      messageList += tpl;
    })

    messagesEle.innerHTML = messageList;
  }

  return {
    renderFriends,
    renderMessages,
  }
})();
