const jwt = require('jsonwebtoken');
const {Usuario} = require('../models')


const generarJWT = (id) =>{

    return new Promise((resolve, reject )=>{

        const payload = {id};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) =>{
            
            if(err){
                console.log(err);
                reject('No se pudo generar el token')
            } else{
                resolve(token);
            }
        })

    })

}

const comprobarJWT = async(token = '') => {

    try {
        if(token === undefined){
            return null;
        }

        const {id} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const usuario = await Usuario.findById(id)

        if(usuario){
            if (usuario.estado){
                return usuario
            } else {
                return null
            }
        } else {
            return true
        }

    } catch (error) {
        return null;
    }

}

module.exports = {
    generarJWT,
    comprobarJWT
}