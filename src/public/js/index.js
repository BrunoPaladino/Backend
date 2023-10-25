const socket = io();        //por medio de socket nos comunicamos con el servidor

let user;       //usuario que ingresa su informacion
let chatBox = document.getElementById('chatBox');   //traemos el chatBox con su ID

//Animacion SweetAlert para ingresar usuario
Swal.fire({
    title: 'Identificate',
    text: 'Ingresa el usuario:',
    icon: 'success',
    input:"text",
    inputValidator: (value) =>{
        return !value && 'Necesitas ingresar tu usuario'
    },
    allowOutsideClick:false //esto impide que evitemos la alerta clickeando en otro lugar de la pantalla
}).then (result=>{
    user = result.value;    //cuando el usuario se loggea, guardamos el nombre en user
    swal.fire({             //y aparece un cartel de que el usuario se conecto al chat
        text: `${user} se ha conectado`,
        toast: true,
        position : 'top-right'
    })
});

chatBox.addEventListener('keyup', (event) =>{
    if(event.key === 'Enter'){
        console.log("hola");
        if(chatBox.value.trim().length>0){  //corroboro que el mensaje no este vacio
            socket.emit('message', {user:user, message:chatBox.value});
            chatBox.value='';   //despues de enviar el mensaje, el input se borra
        }
    }
});

socket.on('messageLogs', (data)=>{
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach((message) => {
        messages = messages + `${message.user} dice : ${message.message} </br>`;
    })
    log.innerHTML = messages;       //escribe en el html los mensajes
})




/* export default socket; */    //con la exportacion la animacion no funciona