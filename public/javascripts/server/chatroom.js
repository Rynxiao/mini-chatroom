const crypto = require('crypto');
const connectors = [];
const messages = [];

module.exports = {
    onConnect(connector) {
        if (!connectors.includes(connector)) {
            connectors.push(connector);
        }
    },
    onLeave(connector) {
      if (connectors.includes(connector)) {
        const index = connectors.indexOf(connector);
        connectors.splice(index, 1);
      }
    },
    receive(message) {
        messages.push(message);
    },
    onError() {},
    getMessages() {
        return messages;
    },
    getConnectors() {
        return connectors;
    },
    getContentKey() {
      const len = messages.length;
      const connectorsStr = connectors.join(',');
      const hash = crypto.createHash('md5');
      hash.update(`${connectorsStr}_${len}`);
      return hash.digest('hex');
    }
}


