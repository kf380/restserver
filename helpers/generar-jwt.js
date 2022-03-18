const jwt = require('jsonwebtoken');


const generateJWT =(uid='')=>{

    return new Promise((resolve,reject)=>{

        const payload = {uid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '6h'
        },(err,token)=>{
            if(err){
                console.error(err);
                reject('No se pudo generar el token')
            }else{
                resolve(token)
            }
        })


    })

}


module.exports ={
    generateJWT
}

