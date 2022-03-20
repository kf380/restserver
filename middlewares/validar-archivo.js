

const validarArchivoSubir = (req,res,next)=>{

      //Consulto si en la request viene la propiedad file, sino viene mando el error 400
    //hago un barrido de todos los files, y si no viene tambien da un error
    //Tambien necesito que venga el nombre del archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg:'No hay archivos que subir -validarArchivoSubir'
        });
      }

    next()
  

}

module.exports = {
    validarArchivoSubir
}