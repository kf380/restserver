const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");



const usuariosGet =async (req, res) => {

    const {limite =5, desde=0 } = req.query;
    const query = {estado:true}


    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res) => {



    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)
    //Guardar en BD
    await usuario.save()

    res.json({
        msg: 'post API - usuariosPost',
        usuario
    });
}

const usuariosPut = async(req, res) => {

    const { id } = req.params;
    const { _id,password, google,correo, ...resto } = req.body;

    // Validar contra base de datos
    if (password) {
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync()
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto )

    res.json(usuario);
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res) => {

    const {id}= req.params;

    //Borrarlo fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false})

    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}