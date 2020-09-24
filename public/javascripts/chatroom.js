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
    }
}


