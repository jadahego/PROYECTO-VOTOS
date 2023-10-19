const { request } = require('express');
const bcrypsjs = require ('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

   // const {q, nombre} = req.query;
   //const {limite = 5, desde = 0} = req.query;

   //const usuarios = await Usuario.find({estado: true})
   //.skip(Number(desde))
   //.limit(Number(limite));

   //const total = await Usuario.countDocuments({estado: true});

   const usauarios = await Usuario.findAll();
    res.json({
        msg: 'getUsuarios',
        usauarios
    })
  }

  const usuariosPut = async  (req, res = response) => {
    const id = req.params.id;
    const {_id, password, google,correo,  ...resto} = req.body;

    //todo validar contra base de datos
    if (password){
       //encriptar la contraseña
    const salt = bcrypsjs.genSaltSync();
    resto.password = bcrypsjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });
  }

  const usuariosPost = async (req, res = response) => {

    const {body} = req;

    try {

      const existeDocumento = await Usuario.findOne({
          where: {
              cedula: body.cedula
          }
      })

      if(existeDocumento){
          return res.status(400).json({
              msg: 'Ya existe un usuario con el Documento' + body.cedula
          })
      }

      const usuario = new Usuario(body)

    //encriptar la contraseña
    //const salt = bcrypsjs.genSaltSync();
    //usuario.password = bcrypsjs.hashSync(password, salt);

    //guardar BD
    await usuario.save();

    res.json({usuario});
    }catch (error){
      console.log(error);
        res.status(500).json({
            msg: 'Hable con el administarador'
        })
    }
      
  } 
  

  const usuariosDelete = async (req, res = response) => {

    const {id} = req.params;

    //const uid = req.uid;

    // Fisicamente se borra
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    //const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        
    });
  }



  module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
  }