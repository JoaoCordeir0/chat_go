var socket = io('https://1d66-2804-431-b740-eacc-8433-2526-7ca4-5128.sa.ngrok.io');

socket.on('receivedMessage', function(message) {
    renderMessage(message);
})

socket.on('previusMessages', function(messages) {
    for (message of messages) {
        renderMessage(message);
        scrollBottom();
    }
});

$("#formChat").submit(function(event) {
    event.preventDefault();

    var user = getCookie('User')
    var message = $("#inputMessage").val();

    var dateNow = new Date();
    var hours = dateNow.getHours();
    var minutes = dateNow.getMinutes();

    if (user.length && message.length) {
        var messageObject = {
            user: user,
            message: message,
            time: hours + ':' + minutes,
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

    var user = $("#inputUser").val();

    if (user.length) {
        setCookie('User', user, 1)
        setCookie('ColorChat', generateColor(), 1)
        window.location.reload(true)
    }
});

// Função que pega o usuario ou seta um novo usuario no chat
function checkUser() {

    if (getCookie('User') != "") {
        $("#formChat").show();
        $("#userON").append(getCookie('User'))

        scrollBottom()
    } else {
        $("#setUser").show();
    }
}

// Resgata os cokies
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Seta um novo cokie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Função que gera uma cor para o usuario
function generateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function renderMessage(message) {
    $(".messages").append('<div class="message ' + socket.id + '"><strong style="color:' + message.colorChat + ';">' + message.user + '</strong>: ' + message.message + '<span style="float:right;">' + message.time + '</span></div>')
}


function scrollBottom() {
    $('.messages').animate({
        scrollTop: 999999
    }, 100);
}

function openSettings() {
    $("#offcanvasSettings").offcanvas('show')

    $("#inputEditUser").attr('value', getCookie('User'))
    $("#inputEditUseColor").attr('value', getCookie('ColorChat'))
}

function saveSettings() {
    let nick = $("#inputEditUser").val();
    let color = $("#inputEditUseColor").val();

    setCookie('User', nick, 1)
    setCookie('ColorChat', color, 1)

    window.location.reload(true)
}