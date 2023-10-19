const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload')

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app)
        this.io = require('socket.io')(this.server)

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        this.candidatosPath = '/api/candidatos';
        this.productosPath = '/api/productos';
        this.buscarPath = '/api/buscar';
        this.uploadPath = '/api/uploads';

        // conectar a base de datos
        this.conectarDB();
        
        //Middlewares (funcion que se ejecuta cuando se levanta el servidor)
        this.middlewares();

        this.routes();

        //socket io
        this.sockets();

      }

     async conectarDB() {
      try {
        await dbConnection.authenticate()
        console.log('database online')
    } catch (error) {
        console.log(error);
    }
     }

      middlewares() {

        //cors
        this.app.use(cors());

        //parseo y lectura del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        // Carga de archivos. 
        this.app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/',
        createParentPath: true
        }));

      }

    routes(){
      this.app.use(this.authPath, require('../routes/auth'));
      this.app.use(this.candidatosPath, require('../routes/candidatos'));
      this.app.use(this.productosPath, require('../routes/productos'));
      this.app.use(this.usuariosPath, require('../routes/user'));
      this.app.use(this.buscarPath, require('../routes/buscar'));
      this.app.use(this.uploadPath, require('../routes/uploads'));
    }
    
    sockets(){
      this.io.on("connection",(socket) => socketController(socket, this.io)) 
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
          })
          
    }


}


module.exports = Server;