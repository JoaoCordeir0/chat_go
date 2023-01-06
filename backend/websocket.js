import { io } from "./http.js";

let users = [];
let messages = [];

io.on('connection', socket => {

    console.clear()
    console.log(users)

    socket.on('newUserConnected', data => {
        const userInlist = users.find(user => user.nick === data.nick)

        if (userInlist) {
            userInlist.socket_id = socket.id;
        } else {
            users.push({
                socket_id: socket.id,
                nick: data.nick,
                avatar: data.avatar,
            });
            socket.broadcast.emit('newUser', data);
        }
    })

    socket.emit('previusUsers', users);

    socket.emit('previusMessages', messages);

    socket.on('sendMessage', data => {
        if (messages.length >= 200) {
            messages.shift();
        }
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });

    socket.on("disconnect", () => {
        const userExit = users.find(user => user.socket_id === socket.id)
        users = users.filter((user) => user.socket_id !== socket.id);

        socket.broadcast.emit('disconnectUser', userExit)
        socket.broadcast.emit('previusUsers', users);
    });
})