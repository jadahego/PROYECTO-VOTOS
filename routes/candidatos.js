const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const {
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria,
        crearCandidato
 } = require('../controllers/candidatos');
const { existeCategoriaPorId } = require('../helpers/db-validators');



const router = Router();

/**
 * /api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias, (req, res) => {
    res.json('get')
})

// Obtener categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria,
 (req, res) => {
    res.json('get-id')
})

// Crear candidato- privado - cualquier token valido
router.post('/',[
    //validarJWT,
    check('partido', 'El partido es obligatorio').not().isEmpty(),
    check('cedula', 'El id de persona es obligatorio').not().isEmpty(),
    validarCampos
], 
crearCandidato,
(req, res) => {
    res.json('post')
})

// Actualizar con id
router.put('/:id',[
    //validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria, 
(req, res) => {
    res.json('put')
})

// borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria, 
(req, res) => {
    res.json('delete')
})


module.exports = router;
