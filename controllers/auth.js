const bcrypt = require('bcrypt');
const { json } = require('express/lib/response');
const { generateJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
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

const googleSignIn = async(req, res)=>{

    const {id_token} = req.body;
try{

    const {correo,nombre,img} = await googleVerify(id_token)
    
    let usuario = await Usuario.findOne({correo});
    if(!usuario){
        //Tengo que crearlo
        const data ={
            nombre,
            correo, 
            password: ':P',
            img,
            google: true
        }
        usuario = new Usuario(data);
        await usuario.save();
    }

    // Si el usuario en DB
    if(!usuario.estado){
        return res.status(401).json({
            msg: ' Hable con el admnistrador, usuario bloqueado'
        })
    }

     //Generar el JWT
    const token = await generateJWT(usuario.id)

    res.json({
        usuario,
        token
    })

   
}catch(error){
    res.status(400).json({
        ok:false,
        msg:'El token no se pudo verificar'
    })
}


}


module.exports ={
    login,
    googleSignIn
}