const Negocio = require('../models/Negocio');
const { validationResult } = require('express-validator');

exports.crearNegocio = async (req, res) => {

    // Error Report
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    try{
        // Create negocio
        const negocio = new Negocio(req.body);
        await negocio.save();
        
        res.status(200).send('Negocio Creado! \n \n' + negocio);
    }catch (error){
        console.log(error);
        res.status(500).send('Se produjo un Error ');
    }
}