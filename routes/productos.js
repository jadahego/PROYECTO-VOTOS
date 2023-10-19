const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearProducto, 
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto} = require('../controllers/productos');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');



const router = Router();

/**
 * /api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', obtenerProductos, (req, res) => {
    res.json('get')
})

// Obtener categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto,
 (req, res) => {
    res.json('get-id')
})

// Crear categoria - privado - cualquier token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], 
crearProducto,
(req, res) => {
    res.json('post')
})

// Actualizar con id
router.put('/:id',[
    validarJWT,
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto, 
(req, res) => {
    res.json('put')
})

// borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto, 
(req, res) => {
    res.json('delete')
})


module.exports = router;