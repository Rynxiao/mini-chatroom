window.ChatNotification = (function(Request) {
  var TIMEOUT = 5000;
  var NOTIFICATION_MAP = {
    SHORT_POLLING: 'SHORT_POLLING',
    LONG_POLLING: 'LONG_POLLING',
    WEBSOCKET: 'WEBSOCKET',
    SSE: 'SSE',
  };
  var selectedType = NOTIFICATION_MAP.SHORT_POLLING;

  var ShortNotification = {
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

  function unsubscribe() {
    switch (selectedType) {
      case NOTIFICATION_MAP.SHORT_POLLING:
        ShortNotification.unsubscribe();
        break;
      default:
        break;
    }
  }

  function subscribe(type, callback) {
    unsubscribe();
    switch (type) {
      case NOTIFICATION_MAP.SHORT_POLLING:
        selectedType = NOTIFICATION_MAP.SHORT_POLLING;
        ShortNotification.subscribe(callback);
        break;
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
