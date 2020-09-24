window.ChatRequest = (function() {
  var connector = document.getElementById('connector');

  var myFetch = function(url, data) {
    var requestArgs = { method: 'GET' };
    if (!!data) {
      requestArgs.method = 'POST';
      requestArgs.body = JSON.stringify({ data: data });
    }
    return fetch(url, requestArgs).then(function(res) {
      return res.json();
    }).catch(function(err) {
      console.error(err);
    });
  }

  function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }

  return {
    register(name) {
      myFetch('/register?name=' + name).then(function(data) {
        if (data.code === 200) {
          connector.textContent = name;
        }
      });
    },
    logout(connector) {
      myFetch('/logout?name=' + connector).then(function (data) {
        if (data.code === 200) {
          connector.textContent = '';
        }
      })
    },
    send(name, text) {
      return myFetch('/send?name=' + name + '&content=' + text).then(function(data) {
        if (data.code === 200) {
          console.log('send data successfully!');
          console.log('name: ' + name + ', content: ' + text );
        }
      });
    },
    getFriends() {
      myFetch('/friends').then(function(data) {
        ChatroomDOM.renderFriends(data.data);
      });
    },
    getMessages(name) {
      myFetch('/messages').then(function(data) {
        ChatroomDOM.renderMessages(data.data, name);
      });
    },
    getFriendsByLongPolling() {
      timeout(5000, myFetch('/friends/long')).then(function (data) {
        ChatroomDOM.renderFriends(data.data);
      });
    }
  }
})();
