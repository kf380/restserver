const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//Obtener todos las categorias - publico
router.get("/", obtenerCategorias)

//Obtener una categoria por id - publico
router.get("/:id",
[
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria)

//Crear categoria - privado - cualquier persona con un token valido
router.post("/",
[
    validarJWT,
    check('nombre', 'El nombre es obligatoria').not().isEmpty(),
    validarCampos

],crearCategoria)

//Actualizar un registro con id - privado - cualquier persona con un token valido
router.put("/:id",
[
    validarJWT,
    check('nombre', 'El nombre es obligatoria').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria)

//Borrar una categoria - Admin
router.delete("/:id",
[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],borrarCategoria)

module.exports =router;