const { response } = require("express");
const { Candidato, Usuario } = require('../models');


// obtener categorias - paginado - total - populate
const obtenerCategorias = async (req, res= response) => {

    const {limite = 5, desde = 0} = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({estado: true}),
        Categoria.find({estado: true})
          .populate('usuario', 'nombre')
          .skip(Number(desde))
          .limit(Number(limite))
       ])
    
        res.json({
            total,
            categorias
        });
}

//Obtener categoria por ID 
const obtenerCategoria = async (req, res = response) => {

    const {id} = req.params
    const categoria = await Candidatos.findById(id).populate('usuario', 'nombre')

    res.json(categoria);
}

//crear candidato
const crearCandidato = async (req, res = response) => {

    const {body} = req;

    try {

    const personaEncontrada = await Usuario.findOne({ where: { cedula: body.cedula } })


    if (!personaEncontrada){
        return res.status(400).json({
            msg: 'No existe usuario con el Documento' + body.cedula
        })
    }
    try {
        const candidato =  await Candidato.create({
            persona_id: personaEncontrada.id,
            cedula: body.cedula,
            partido: body.partido,
          })

          res.json({candidato});

           //guardar BD
    await candidato.save();

    } catch (error) {
        return res.status(400).json({
            msg: 'candidato ya se encuentra registrado con documento' + body.cedula
        })
    }
    
      
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administarador'
        })
    }
    
  } 
  

// Actualizar categorias 
const actualizarCategoria = async (req, res= response) => {

    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

    res.json(categoria);

}

// Borrar categoria - estado: false
const borrarCategoria = async (req, res= response) =>{

    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new:true})

    res.json(categoriaBorrada);
}



module.exports = {
    crearCandidato,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}