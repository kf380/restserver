const Role = require('../models/role')
const {Usuario, Categoria} = require('../models')


const esRoleValido = async(rol = '')=>{
    const existeRol = await Role.findOne({rol})
    if(!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}
const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id: ${ id } no existe`);
    }
}

const existeCategoriaPorId =async(id)=>{
    //Verificar si la categoria existe
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria) {
        throw new Error(`El id: ${ id } no existe`)
    }

}
const existeProductoPorId =async(id)=>{
    //Verificar si el producto existe
    const existeProducto = await Producto.findById(id);
    if(!existeProducto) {
        throw new Error(`El id: ${ id } no existe`)
    }

}

const coleccionesPermitidas = (coleccion='',colecciones=[])=>{

    const incluida = colecciones.includes(coleccion);
    if(!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }
    return true;


}


module.exports ={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}