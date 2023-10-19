const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');



const login = async (req, res = response) => {

    const {nombre, documento} = req.body;

    try {
        
        // verificar si el nombre existe
        const usuario = await Usuario.findOne({nombre});
        if (!usuario){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - nombre '
            })
        }

        // si el usuario esta activo
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario /  no son correctos - estado: false '
            })
        }

        // verificar contraseña
        const validDocumento = await Usuario.findOne({documento});
        if (!validDocumento){
            return res.status(400).json({
                msg: 'Usuario / documento no son correctos - documento '
            })
        }
        // general el jwt
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })

    } catch (error) {
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

   }

   const googleSignIn = async (req, res = response) => {

        const {id_token} = req.body;

        try {

            const {correo, nombre, img} = await googleVerify(id_token);
            
            let usuario = await Usuario.findOne({correo});

            if(!usuario){
                // tengo que crearlo
                const data = {
                    nombre,
                    correo,
                    password: ':p',
                    img,
                    google: true
                }
                usuario = new Usuario(data);
                await usuario.save();
            }

            // si el usuario en DB
            if (!usuario.estado){
                return res.status(401).json({
                    msg: 'Hable con el administrador usuario bloqueado'
                })
            }

            // general el jwt
            const token = await generarJWT(usuario.id);

            res.json({
                msg: 'todo ok',
                usuario,
                token
            })
        } catch (error) {
            json.status(400).json({
                msg: 'El token no se pudo verificar'
            })
        }
   }

   const renovarToken = async (req, res = response) => {
        const {usuario} = req;

        // general el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
   }

module.exports = {
    login,
    googleSignIn,
    renovarToken
}