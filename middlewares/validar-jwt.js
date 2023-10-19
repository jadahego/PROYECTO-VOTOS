const {response, request} = require('express')
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');


const validarJWT = async (req, res = response, next) => {

    const token = req.header = req.header('x-token');
    //console.log("Google Token", token)

    if (!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {

       const {cedula} =  jwt.verify(token, process.env.SECRETORPRIVATEKEY );

       // leer el usuario que corresponde al uid 
       const usuario = await Usuario.findOne(cedula);

       if(!usuario){
        return res.status(401).json({
            msg: 'token no valido - usuario no existe en DB'
        })
       }

       // verificar si el uid tiene estado true
       if (!usuario.estado){
        return res.status(401).json({
            msg: 'token no valido - usuario con estado: false'
        })
       }
        
        req.usuario = usuario;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
        
    }

}


module.exports = {
    validarJWT
}