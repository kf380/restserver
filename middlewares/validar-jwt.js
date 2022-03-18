
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario')

const validarJWT = async(req,res,next)=>{

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }
    
    try{

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        //leer el usuario que corresponde al uid
        const usuario= await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg:'Token no valido - usuario no existe DB'
            })
        }

        //verificar si el uid tiene el estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Token no valido - usuario con estado: false'
            })
        }

       req.usuario = usuario;

        next()

    }catch(err){
        console.error(err);
        res.status(401).json({
            msg:'Token no valido'
        })
    }

}


module.exports ={
    validarJWT
}