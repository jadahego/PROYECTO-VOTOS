

const dbValidators = require('./db-validators')
const generarJWT = require('./generarJWT')
const goggleVerify = require('./google-verify')
const subirArchivo = require('./subir-archivo')

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...goggleVerify,
    ...subirArchivo
}