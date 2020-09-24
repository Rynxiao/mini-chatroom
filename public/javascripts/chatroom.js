const connectors = [];
const messages = [];

module.exports = {
    onConnect(connector) {
        if (!connectors.includes(connector)) {
            connectors.push(connector);
        }
    },
    print(messages) {
        messages.push(messages);
    },
    onError() {},
    getMessages() {
        return messages;
    },
    getConnectors() {
        return connectors;
    }
}


