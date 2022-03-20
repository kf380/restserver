const {Categoria} = require('../models')

//obtenerCategorias - paginado - total - populate

const obtenerCategorias =async (req, res) => {

    const {limite =5, desde=0 } = req.query;
    const query = {estado:true}


    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    });
}




//obtenerCategorias - populate {}

const obtenerCategoria = async(req, res) => {

    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json(categoria);


}


const crearCategoria = async(req,res)=>{
    //Leo el nombre que viene del body y lo dejo en mayusculas
    const nombre = req.body.nombre.toUpperCase();
    //Pregunto si existe una categoria con ese nombre
    const categoriaDB = await Categoria.findOne({nombre});
    //Si exixte
    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre}, ya existe`
        })
    }
    //Si no existe
    //Generar la data a guardar
    const data={
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar db
    await categoria.save();

    res.status(201).json(categoria);


 }


 //actualizarCategoria
 const actualizarCategoria = async(req, res) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
   

    //Nombre nuevo de la categoria que estoy actualizando en mayusculas
    data.nombre = data.nombre.toUpperCase();
    //Id del usuario dueño del token 
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true} )

    res.json(categoria);
}


 //borrarCategoria - estado:false
 const borrarCategoria = async(req, res) => {

    const {id}= req.params;
    

    //Borrarlo fisicamente
    // const categoria = await Categoria.findByIdAndDelete(id)

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false})
    
    res.json(categoria);
}






 module.exports ={
     obtenerCategorias,
     obtenerCategoria,
     crearCategoria,
     actualizarCategoria,
     borrarCategoria
 }