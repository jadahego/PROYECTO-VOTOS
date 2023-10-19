const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");


const cargarArchivo = async (req, res = response) => {

      try {
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos')
        const nombre = await subirArchivo(req.files, undefined, 'imgs')

     res.json({
        nombre
     })
      } catch (msg) {
        res.status(400).json({msg})
      }
     

}

const actualizarArchivo = async (req, res= response) =>{

    const {id, coleccion} = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo =  await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            
            return res.status(500).json({msg: 'Se me olvido validar esto'})
    }

    //Limpiar imagenes previas
    if(modelo.img){
        // hay que borra la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen)
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo)
}

const actualizarArchivoCloudinary = async (req, res= response) =>{

  const {id, coleccion} = req.params
try {
    let modelo;

  switch (coleccion) {
      case 'usuarios':
          modelo =  await Usuario.findById(id);
          if(!modelo){
              return res.status(400).json({
                  msg: `No existe un usuario con el id ${id}`
              })
          }
          break;

      case 'productos':
          modelo = await Producto.findById(id);
          if(!modelo){
              return res.status(400).json({
                  msg: `No existe un producto con el id ${id}`
              })
          }
          break;
  
      default:
          
          return res.status(500).json({msg: 'Se me olvido validar esto'})
  }

  //Limpiar imagenes previas
  if(modelo.img){
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length-1]
    const [public_id] = nombre.split('.')

    cloudinary.uploader.destroy(public_id)
  }
  
  
  const{tempFilePath} = req.files.archivo
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

  //const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo)
} catch (error) {
    console.log(error)

    return res.status(400).json({
        msg: 'La imagen no se cargo.'
    })
}
  
}

const mostrarImagen = async (req, res = response) => {

    const {id, coleccion} = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo =  await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            
            return res.status(500).json({msg: 'Se me olvido validar esto'})
    }

    //Limpiar imagenes previas
    if(modelo.img){
        // hay que borra la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }

    const pathImagenAssets = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(pathImagenAssets);
}


module.exports = {
    cargarArchivo,
    actualizarArchivo,
    mostrarImagen,
    actualizarArchivoCloudinary
}