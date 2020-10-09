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
    subscribe: function() {
      this.datasInterval = setInterval(function() {
        Request.getDatas().then(function(res) {
          window.ChatroomDOM.renderData(res);
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
    subscribe: function() {
      var that = this;

      Request.getV2Datas(this.getKey(),{ timeout: 10000 }).then(function(res) {
        var data = res.data;
        window.ChatroomDOM.renderData(res);
        that.subscribe();
        that.setKey(data.key);
      }).catch(function (error) {
        that.subscribe();
      });
      return this.unsubscribe;
    },
    unsubscribe: function() {
      Request.unsubscribeV2();
    }
  }

  var WebsocketNotification = {
    socket: null,
    subscribe: function(args) {
      var connector = args[1];
      this.socket = io();

      this.socket.emit('register', connector);

      this.socket.on('register done', function() {
        window.ChatroomDOM.renderAfterRegister();
      });

      this.socket.on('data', function(res) {
        window.ChatroomDOM.renderData(res);
      });

      this.socket.on('disconnect', function() {
        window.ChatroomDOM.renderAfterLogout();
      });

      return this.unsubscribe;
    },
    send: function(message) {
      if (this.socket) {
        this.socket.emit('chat', message);
      }
    },
    unsubscribe: function() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    }
  }

  var SSENotification = {
    source: null,
    subscribe: function() {
      if ('EventSource' in window) {
        this.source = new EventSource('/sse');

        this.source.addEventListener('message', function(res) {
          console.log('event', res);
          const d = res.data;
          window.ChatroomDOM.renderData(JSON.parse(d));
        });
      }
      return this.unsubscribe;
    },
    unsubscribe: function () {
      this.source && this.source.close();
    }
  }

  function unsubscribe() {
    switch (selectedType) {
      case NOTIFICATION_MAP.SHORT_POLLING:
        ShortPollingNotification.unsubscribe();
        break;
      case NOTIFICATION_MAP.LONG_POLLING:
        LongPollingNotification.unsubscribe();
        break;
      case NOTIFICATION_MAP.WEBSOCKET:
        WebsocketNotification.unsubscribe();
        break;
      case NOTIFICATION_MAP.SSE:
        SSENotification.unsubscribe();
        break;
      default:
        break;
    }
  }

  function subscribe() {
    var args = arguments;
    var type = args[0];
    unsubscribe();
    switch (type) {
      case NOTIFICATION_MAP.SHORT_POLLING:
        selectedType = NOTIFICATION_MAP.SHORT_POLLING;
        ShortPollingNotification.subscribe();
        break;
      case NOTIFICATION_MAP.LONG_POLLING:
        selectedType = NOTIFICATION_MAP.LONG_POLLING;
        LongPollingNotification.subscribe();
        break;
      case NOTIFICATION_MAP.WEBSOCKET:
        selectedType = NOTIFICATION_MAP.WEBSOCKET;
        WebsocketNotification.subscribe(args);
        break;
      case NOTIFICATION_MAP.SSE:
        selectedType = NOTIFICATION_MAP.SSE;
        SSENotification.subscribe();
        break;
      default:
        break;
    }
  }

  return {
    subscribe,
    unsubscribe,
    send: WebsocketNotification.send.bind(WebsocketNotification),
    NOTIFICATION_MAP,
  }
})(ChatRequest);
