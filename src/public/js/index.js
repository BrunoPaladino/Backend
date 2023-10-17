const socket = io();        //por medio de socket nos comunicamos con el servidor
socket.emit('message', "Hola, soy un usuario");

export default socket;