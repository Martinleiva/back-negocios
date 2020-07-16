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

        res.status(200).json(etiqueta);

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