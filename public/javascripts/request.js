window.ChatRequest = (function() {
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
      return myFetch('/register?name=' + name);
    },
    logout(connector) {
      return myFetch('/logout?name=' + connector);
    },
    send(name, text) {
      myFetch('/send?name=' + name + '&content=' + text).then(function(data) {
        if (data.code === 200) {
          console.log('send data successfully!');
          console.log('name: ' + name + ', content: ' + text );
        }
      });
    },
    getDatas() {
      return myFetch('/datas');
    },
  }
})();
