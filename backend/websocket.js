import { io } from "./http.js";

let usersOn = [];
let messages = [];

io.on('connection', socket => {

    if (usersOn.length > 0) {
        console.log(usersOn);
    }

    socket.on('newUserConnected', data => {
        const userInlist = usersOn.find(user => user.nick_user === data.nick)

        if (userInlist) {
            userInlist.socket_id = socket.id;
        } else {
            usersOn.push({
                socket_id: socket.id,
                nick_user: data.nick,
            });
            socket.broadcast.emit('newUser', data);
        }
    })

    socket.emit('previusMessages', messages);

    socket.on('sendMessage', data => {
        if (messages.length >= 200) {
            messages.shift();
        }
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });

    //socket.on("disconnect", () => {
    //    // code
    //});
})