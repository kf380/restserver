const mongoose = require('mongoose')

const dbConnection = async () =>{

    try{

        await mongoose.connect(process.env.DB_CONNECT,{
            useNewUrlParser:true,
            useUnifiedUrlParser:true,
            useCreateIndex:true,
            useFindandModify:false
        })

        console.log('Base de datos online')

    }catch(error){
        console.log(error)
        throw new Error('Error en la base de datos')
    }

}



module.export ={
    dbConnection
}