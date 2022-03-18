const bcrypt = require('bcrypt');
const { generateJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/Usuario')


const login = async(req,res)=>{

    const { correo, password } = req.body;

    try{

        // Verificar si el email existe con
        const usuario = await Usuario.findOne({correo})
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }


        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            })
        }
        //Verificar la contraseña 
        const validPassword = bcrypt.compareSync(password, usuario.password)
        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }
        //Generar el JWT
        const token = await generateJWT(usuario.id)
        res.json({
            usuario,
            token
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            msg:'Hable con el admnistrador'
        })
    }

    
}


module.exports ={
    login
}