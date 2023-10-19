const { Socket } = require("socket.io")
const { comprobarJWT } = require("../helpers")
const {ChatMensajes} = require('../models')


const chatMensajes = new ChatMensajes()

const socketController = async(socket = new Socket(), io) => {

    //console.log('cliente conectado', socket.id)
    const usuario = await comprobarJWT(socket.handshake.headers['x-token'])
    if(!usuario){
        return socket.disconnect()
    }
    //console.log('Se conecto', usuario.nombre)

    // Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)

    //conectar a una sala privada 
    socket.join(usuario.nombre); //global, socket.id, usuario.id o por id

    //Limpiar cuando algo se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.documento)
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje', ({documento, mensaje}) => {

        if(documento){
            // mensaje privado
            socket.to(documento).emit('mensaje-privado', {de: usuario.nombre, mensaje })
        }else {
            chatMensajes.enviarMensaje(usuario.documento, usuario.nombre, mensaje)
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }
    })
}



module.exports = {
    socketController
}