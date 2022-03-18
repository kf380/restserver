

const esAdminRole = (req,res,next)=>{

    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const {rol,nombre} = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es adminsitrador - No puede realizar esto`
        })
    }

    next();

}

const tieneRole = (...roles)=>{

    return (req, res, next)=>{
        //Verificacion del token
        if(!req.usuario){
            return res.status(500).json({
                msg:'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if(roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg:`El servicio requiere de uno de estos roles ${roles}`
            })
        }

        next();
    }
}

module.exports ={
    esAdminRole,
    tieneRole,
}