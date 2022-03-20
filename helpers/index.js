

const dbValidator = require('./db-validators');
const generateJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');


module.exports ={
    ...dbValidator,
    ...generateJWT,
    ...googleVerify,
    ...subirArchivo
}