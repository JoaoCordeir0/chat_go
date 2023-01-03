// Renderiza as mensagem na tela
function renderMessage(message) {
    $(".messages").append('<div class="message"><img src="img/' + message.imguser + '" width="30px"><strong style="margin-left:5px; color:' + message.colorChat + ';">' + message.user + '</strong>: ' + message.message + '<span class="timeMessage pt-2">' + message.time + '</span></div>')
}

// Renderiza as notificações na tela
function renderNotification(user, action) {
    switch (action) {
        case 'newUser':
            txt = ' entrou no chat';
            break;
        case 'exitUser':
            txt = ' saiu do chat';
            break;
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'info',
        title: user.nick + txt
    })
}

// Função que pega o usuario ou seta um novo usuario no chat
function checkUser() {
    if (getCookie('NickUser') != "") {
        $("#formChat").show();
        $("#userON").append(getCookie('NickUser'))

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

// Deixa o scroll sempre no fim da pagina
function scrollBottom() {
    $('.messages').animate({
        scrollTop: 9999999
    }, 100);
}

// Abre as configurações
function openSettings() {
    $("#offcanvasSettings").offcanvas('show')

    $("#inputEditUser").attr('value', getCookie('NickUser'))
    $("#inputEditUseColor").attr('value', getCookie('ColorChat'))
}

// Salva as configurações
function saveSettings() {
    let nick = $("#inputEditUser").val();
    let color = $("#inputEditUseColor").val();

    setCookie('NickUser', nick, 1)
    setCookie('ColorChat', color, 1)

    window.location.reload(true)
}