const Etiqueta = require('../models/Etiqueta');
const { validationResult } = require('express-validator');

exports.crearEtiqueta = async (req, res) => {
    // Revisa si no hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const {nombre_etiqueta} = req.body;

        // Busca si existe ya una etiqueta con ese nombre o no
        let etiqueta = await Etiqueta.findOne({ nombre_etiqueta });
        if(etiqueta){
            return res.status(400).json({ msg: 'Ya existe una etiqueta con ese nombre' });
        }

        // Crea la nueva etiqueta
        etiqueta = new Etiqueta(req.body);
        await etiqueta.save();

        res.status(200).json({
            'msg': 'Etiqueta agregada con éxito!',
            etiqueta
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(`Se produjo un Error`);
    }
}

exports.obtenerListadoEtiquetas = async (req, res) => {
    try {
        const etiquetas = await Etiqueta.find().sort({ nombre_etiqueta: 1 });
        res.json({ etiquetas });
    } catch (error) {
        console.log(error);
        res.status(500).send(`Se produjo un Error`);
    }
}

exports.actualizarEtiqueta = async (req, res) => {
    // Revisar si no hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { nombre_etiqueta } = req.body;
        const nuevaEtiqueta = {};
        if(nombre_etiqueta){
            nuevaEtiqueta.nombre_etiqueta = nombre_etiqueta;
        }

        let etiqueta = await Etiqueta.findById(req.params.id);

        if(!etiqueta){
            return res.status(404).json({msg:'Etiqueta no encontrada'});
        }

        // Busca si existe ya una etiqueta con ese nombre o no
        etiqueta = await Etiqueta.findOne({ nombre_etiqueta });
        if(etiqueta){
            return res.status(400).json({ msg: 'Ya existe una etiqueta con ese nombre' });
        }

        etiqueta = await Etiqueta.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevaEtiqueta }, { new: true });

        res.json({ 
            'msg': 'Etiqueta actualizada con éxito!',
            etiqueta 
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(`Se produjo un Error`);
    }
}