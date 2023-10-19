
let usuario = null;
let socket = null

//referencias html
const txtUid = document.querySelector('#txtDocumento')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')

const validarJWT = async () =>{
    const token = localStorage.getItem('token');

    if (token === undefined) {
        window.location = 'index.html'
        console.log('No hay token en el servidor');
    }

    let resp = await fetch(('http://localhost:8080/api/auth/'), {
        headers: {'x-token': token}
    })

    resp = await resp.json();
    

    localStorage.setItem('token', resp.token)
    usuario = resp.usuario
    document.title = usuario.nombre;

    await conectarSocket();
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });
    socket.on('connect', () =>{
        console.log('Socket online')
    })

    socket.on('disconnect', () =>{
        console.log('Socket offline')
    })

    socket.on('recibir-mensajes', dibujarMensajes)

    socket.on('usuarios-activos', dibujarUsuarios)

    socket.on('mensaje-privado', (payload) =>{
        // todo
        console.log('privado', payload)
    })
}

const dibujarUsuarios = (usuarios = []) => {

    let usersHtml = ''
    usuarios.forEach( ({nombre, documento}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${nombre}</h5>
                    <spam class="fs-6 text-muted">${documento}</spam>
                </p>
            </li>
        `
    })
    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes = []) => {

    let mensajesHtml = ''
    mensajes.forEach( ({nombre, mensaje}) => {
        mensajesHtml += `
            <li>
                <p>
                    <apan class="text-primary"> ${nombre}: </span>
                    <span class="text-success">${mensaje}</span>
                </p>
            </li>
        `
    })
    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({keyCode}) => {

    const mensaje = txtMensaje.value
    const documento = txtDocumento.value

    if(keyCode !== 13){return}
    if(mensaje.length === 0){return}

    socket.emit('enviar-mensaje', {mensaje, documento})
    txtMensaje.value=''
})


const main =  async() => {

    await validarJWT();

}




main();

//const socket = io();