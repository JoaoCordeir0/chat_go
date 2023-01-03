var socket = io();

var dateNow = new Date();
var hours = dateNow.getHours();
var minutes = dateNow.getMinutes();

socket.on('newUser', function(user) {
    renderNotification(user, 'newUser');
})

socket.on('receivedMessage', function(message) {
    renderMessage(message);
})

socket.on('previusMessages', function(messages) {
    for (message of messages) {
        renderMessage(message);
        scrollBottom();
    }
});

$(document).ready(function() {
    var nick = getCookie('NickUser');
    if (nick.length > 0) {
        socket.emit('newUserConnected', {
            nick
        })
    }
});

$("#formChat").submit(function(event) {
    event.preventDefault();

    var user = getCookie('NickUser')
    var message = $("#inputMessage").val();

    if (user.length && message.length) {

        if (message.includes('http')) {
            message = "<a href=" + message + " target='_blank'>" + message + "</a>";
        }

        var messageObject = {
            user: user,
            message: message,
            time: hours + ':' + minutes,
            imguser: getCookie('ImgUser'),
            colorChat: getCookie('ColorChat'),
        };

        $("#inputMessage").val("");

        renderMessage(messageObject);
        scrollBottom()

        socket.emit('sendMessage', messageObject);
    }
});

$("#setUser").submit(function(event) {
    event.preventDefault();

    var nick = $("#inputUser").val();

    if (nick.length) {
        setCookie('NickUser', nick, 1)
        setCookie('ImgUser', 'user.png', 1)
        setCookie('ColorChat', generateColor(), 1)

        socket.emit('newUserConnected', {
            nick
        })

        window.location.reload(true)
    }
});