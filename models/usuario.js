
const DataTypes = require('sequelize');
const { dbConnection } = require('../database/config');

const Usuario = dbConnection.define('personas', {
    nombre: {
        type: DataTypes.STRING
    },
    apellido: {
        type: DataTypes.STRING
    },
    cedula: {
        type: DataTypes.NUMBER
    },
    estado: {
        type: DataTypes.BOOLEAN
    },
    localidad: {
        type: DataTypes.STRING
    }
})

module.exports = Usuario;