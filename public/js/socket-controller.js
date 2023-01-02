var socket = io('http://localhost:3000');

socket.on('receivedMessage', function(message) {
    renderMessage(message);
})

socket.on('previusMessages', function(messages) {
    for (message of messages) {
        renderMessage(message);
        scrollBottom();
    }
});