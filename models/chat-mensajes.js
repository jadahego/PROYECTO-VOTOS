class Mensaje {
    constructor(documento, nombre, mensaje){
        this.documento = documento
        this.nombre = nombre
        this.mensaje = mensaje
    }
}


class ChatMensajes {
    constructor(){
        this.mensajes = [];
        this.usuarios = {}
    }

    get ultimos10(){
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes
    }

    get usuariosArr(){
        return Object.values(this.usuarios)
    }

    enviarMensaje(documento, nombre, mensaje){
        this.mensajes.unshift(
            new Mensaje(documento, nombre, mensaje)
        )
    }

    conectarUsuario(usuario){
        this.usuarios[usuario.documento] = usuario
    }


    desconectarUsuario(documento){
        delete this.usuarios[documento]
    }
}

module.exports = ChatMensajes