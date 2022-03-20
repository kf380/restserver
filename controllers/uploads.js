const fs = require("fs");
const path = require('path')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models')


const cargarArchivo = async (req, res) => {


    try {
        //Imagenes
        // const nombre = await subirArchivo(req.files,['txt','md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({ nombre });

    } catch (msg) {
        res.status(400).json({ msg })
    }

}

const actualizarArchivo = async (req, res) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(404).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(404).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        //Hay que borrar la imagen del servidor 
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    try {

    } catch (e) {
        console.log(e)
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();


    res.json(modelo);

}
const actualizarImagenCloudinary = async (req, res) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(404).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(404).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.')
        cloudinary.uploader.destroy(public_id)
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url;

    await modelo.save();


    res.json(modelo);

}

const mostrarImagen = async (req, res) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(404).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(404).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        //Hay que borrar la imagen del servidor 
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(pathImagen)
}

module.exports = {
    cargarArchivo,
    actualizarArchivo,
    mostrarImagen,
    actualizarImagenCloudinary
}