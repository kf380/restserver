const {Producto} = require('../models')

//obtenerProductos - paginado - total - populate

const obtenerProductos =async (req, res) => {

    const {limite =5, desde=0 } = req.query;
    const query = {estado:true}


    const [total,productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario','nombre')
        .populate('categoria','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    });
}




//obtenerProducto - populate {}

const obtenerProducto = async(req, res) => {

    const {id} = req.params;
    const producto = await Producto.findById(id)
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.json(producto);


}


const crearProducto = async(req,res)=>{
    //Leo el nombre que viene del body y lo dejo en mayusculas
    const {estado, usuario, ...body} = req.body;
    //Pregunto si existe una categoria con ese nombre
    const productoDB = await Producto.findOne({nombre:body.nombre});
    //Si exixte
    if(productoDB){
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre}, ya existe`
        })
    }
    //Si no existe
    //Generar la data a guardar
    const data={
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //Guardar db
    await producto.save();

    res.status(201).json(producto);


 }


 //actualizarCategoria
 const actualizarProducto = async(req, res) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
   
    //Nombre nuevo de la categoria que estoy actualizando en mayusculas
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    //Id del usuario dueño del token 
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true} )

    res.json(producto);
}


 //borrarCategoria - estado:false
 const borrarProducto = async(req, res) => {

    const {id}= req.params;
    

    //Borrarlo fisicamente
    // const categoria = await Categoria.findByIdAndDelete(id)

    const producto = await Producto.findByIdAndUpdate(id, {estado:false})
    
    res.json(producto);
}






 module.exports ={
     obtenerProductos,
     obtenerProducto,
     crearProducto,
     actualizarProducto,
     borrarProducto
 }