window.ChatRequest = (function($) {
  var myAjax = function(url, config) {
    var requestArgs = { method: 'GET', ...config };
    return new Promise(function(resolve, reject) {
      $.ajax({ url, ...requestArgs }).done(function(res) {
        resolve(res);
      }).fail(function (error) {
        reject(error);
      });
    });
  }

  return {
    register(name) {
      return myAjax('/register?name=' + name);
    },
    logout(connector) {
      return myAjax('/logout?name=' + connector);
    },
    send(name, text) {
      myAjax('/send?name=' + name + '&content=' + text).then(function(data) {
        if (data.code === 200) {
          console.log('send data successfully!');
          console.log('name: ' + name + ', content: ' + text );
        }
      });
    },
    getDatas() {
      return myAjax('/datas');
    },
    getV2Datas(key, config) {
      return myAjax('/v2/datas?key=' + key, config);
    },
    unsubscribeV2() {
      myAjax('/v2/unsubscribe')
    },
  }
})(jQuery);
