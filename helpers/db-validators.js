const Role = require('../models/role')
const {Usuario, Categoria, Producto} = require('../models');
const { response } = require('express');


const esRoleValido = async (rol = '') =>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol){
            throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

const passwordExiste = async (documento ='') => {

    //verificar si el correo existe
    const existePassword = await Usuario.findOne({documento});
    if (existePassword){
        throw new Error(`El documento ${documento} ya existe`) 
        }
}

const existeUsuarioPorId = async (id = '') => {
    //verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`El id no existe: ${id} `)
    }
}

/**
 * Categorias 
 */
const existeCategoriaPorId = async (id) => {

    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria){
        throw new Error(`El id no existe ${id}`);
    }
}

/**
 * Producto
 */
const existeProductoPorId = async (id) => {

    const existeProducto = await Producto.findById(id);
    if (!existeProducto){
        throw new Error(`El id no existe ${id}`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion)
    if(!incluida){
        throw new Error(`la coleccion ${coleccion} no es permitida, ${colecciones}`)
    }

    return true

}

module.exports = {
    esRoleValido,
    passwordExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}