import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");

//判断连接是否成功
socket.on("connect", () => {
    console.log(socket.connected,'连接成功'); // true
});

//发送信息
export const send = (data) => {
    socket.emit('message-send', { data })
}

//接受信息
export const over = () => {
    socket.on('message-over', (data) => {
        console.log(data,666);
    })
}

