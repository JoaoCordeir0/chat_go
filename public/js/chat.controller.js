var socket = io('');

nick = getCookie('NickUser');
avatar = getCookie('ImgUser');

socket.on('newUser', function(users) {
    renderUsers(users);
    renderNotification(users, 'newUser');
})

socket.on('disconnectUser', user => {
    renderNotification(user, 'exitUser');
})

socket.on('previusUsers', function(users) {
    $("#connectedUsers").html("");
    for (user of users) {
        renderUsers(user);
    }
})

socket.on('receivedMessage', function(message) {
    renderMessage(message);
    scrollBottom();
})

socket.on('previusMessages', function(messages) {
    for (message of messages) {
        renderMessage(message);
        scrollBottom();
    }
});

$(document).ready(function() {
    if (nick.length > 0) {
        socket.emit('newUserConnected', {
            nick,
            avatar,
        })
    }
});

$("#formChat").submit(function(event) {
    event.preventDefault();

    let date = new Date();
    let time = date.toLocaleTimeString("pt-BR", {
        timeStyle: "short",
        hour12: false,
        numberingSystem: "latn"
    });
    var user = getCookie('NickUser')
    var message = $("#inputMessage").val();

    if (user.length && message.length) {

        if (message.includes('http')) {
            message = "<a href=" + message + " target='_blank'>" + message + "</a>";
        }

        var messageObject = {
            user: user,
            message: message,
            time: time,
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

    if (nick.length <= 11) {
        let avatar = 'avatar-' + Math.floor(Math.random() * 5) + '.png';
        setCookie('NickUser', nick, 1)
        setCookie('ImgUser', avatar, 1)
        setCookie('ColorChat', generateColor(), 1)

        socket.emit('newUserConnected', {
            nick,
            avatar,
        })

        window.location.reload(true)
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Opss...',
            text: 'Seu nick deve conter no máximo 11 caracteres'
        })
    }
});