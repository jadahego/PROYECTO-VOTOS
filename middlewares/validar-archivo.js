const { response } = require("express")


const validarArchivoSubir = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json('No hay archivos que subir - archivo');
        return;
      }
    
      if (!req.files.archivo ) {
          res.status(400).json('No hay archivos que subir - archivo');
          return;
        }

        next();
}

module.exports = {
    validarArchivoSubir
}