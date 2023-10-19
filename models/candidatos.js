
const DataTypes = require('sequelize');
const { dbConnection } = require('../database/config');
const Usuario = require('../models/usuario');


const Candidato = dbConnection.define('candidatos', {
    partido: {
        type: DataTypes.STRING,
        required: [true, 'El partido es obligatorio'],
        unique: 'partido_persona'
    },
    persona_id: {
        type: DataTypes.STRING,
        required: true,
        unique: true
    },
    cedula:{
        type: DataTypes.INTEGER,
        required: true,
        unique: true
    }
});

Candidato.belongsTo(Usuario, { foreignKey: 'cedula' });


module.exports = Candidato;