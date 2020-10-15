var Event = {
  events: [],
  subscribe: function(func) {
    var that = this;
    this.events.push(func);
    return function() {
      that.events.forEach(function(event, index) {
        if (event === func) {
          that.events.splice(index, 1);
        }
      });
    }
  },
  emit: function(data) {
    if (this.events.length !== 0) {
      this.events.forEach(function(event) {
        event && event(data);
      });
    }
  }
};

module.exports = Event;
