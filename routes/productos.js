const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT,validarCampos, esAdminRole } = require('../middlewares');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId} = require('../helpers/db-validators');


const router = Router();

//Obtener todos las categorias - publico
router.get("/", obtenerProductos)

//Obtener una categoria por id - publico
router.get("/:id",[
    check('id', 'No es un id de Mongo valido').isMongoId(),
    // check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto)

//Crear categoria - privado - cualquier persona con un token valido
router.post("/",
[
    validarJWT,
    check('nombre', 'El nombre es obligatoria').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos

],crearProducto)

//Actualizar un registro con id - privado - cualquier persona con un token valido
router.put("/:id",
[
    validarJWT,
    // check('categoria', 'No es un id de Mongo').isMongoId(),
    // check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto)

//Borrar una categoria - Admin
router.delete("/:id",
[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    // check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto)

module.exports =router;