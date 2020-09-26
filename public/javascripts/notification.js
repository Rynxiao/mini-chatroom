window.ChatNotification = (function(Request) {
  var TIMEOUT = 5000;
  var NOTIFICATION_MAP = {
    SHORT_POLLING: 'SHORT_POLLING',
    LONG_POLLING: 'LONG_POLLING',
    WEBSOCKET: 'WEBSOCKET',
    SSE: 'SSE',
  };
  var selectedType = NOTIFICATION_MAP.SHORT_POLLING;

  var ShortPollingNotification = {
    datasInterval: null,
    subscribe: function(callback) {
      this.datasInterval = setInterval(function() {
        Request.getDatas().then(function(res) {
          callback && callback(res);
        })
      }, TIMEOUT);
      return this.unsubscribe;
    },
    unsubscribe: function() {
      this.datasInterval && clearInterval(this.datasInterval);
    }
  }

  var LongPollingNotification = {
    setKey: function(key) {
      localStorage.setItem('key', key);
    },
    getKey: function() {
      return localStorage.getItem('key') || 'new';
    },
    subscribe: function(callback) {
      var that = this;

      Request.getV2Datas(this.getKey(),{ timeout: 10000 }).then(function(res) {
        var data = res.data;
        callback && callback(res);
        that.subscribe(callback);
        that.setKey(data.key);
      }).catch(function (error) {
        that.subscribe(callback);
      });
      return this.unsubscribe;
    },
    unsubscribe: function() {
      Request.unsubscribeV2();
    }
  }

  function unsubscribe() {
    switch (selectedType) {
      case NOTIFICATION_MAP.SHORT_POLLING:
        ShortPollingNotification.unsubscribe();
        break;
      case NOTIFICATION_MAP.LONG_POLLING:
        LongPollingNotification.unsubscribe();
      default:
        break;
    }
  }

  function subscribe(type, callback) {
    unsubscribe();
    switch (type) {
      case NOTIFICATION_MAP.SHORT_POLLING:
        selectedType = NOTIFICATION_MAP.SHORT_POLLING;
        ShortPollingNotification.subscribe(callback);
        break;
      case NOTIFICATION_MAP.LONG_POLLING:
        selectedType = NOTIFICATION_MAP.LONG_POLLING;
        LongPollingNotification.subscribe(callback);
      default:
        break;
    }
  }

  return {
    subscribe,
    unsubscribe,
    NOTIFICATION_MAP,
  }
})(ChatRequest);
