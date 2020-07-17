const Negocio = require('../models/Negocio');
const { validationResult } = require('express-validator');

exports.crearNegocio = async (req, res) => {

    // Error Report
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    try{
        // verificate 'nombre --> negocio' (unique)
        const nombre = req.body.nombre;
        let negocio_duplicate = await Negocio.findOne( {nombre} );
        if ( negocio_duplicate ){
            return res.status(400).
                        json({ msg: 'Ya existe un Negocio con el nombre: '+ nombre });
        }

        // Create negocio
        const negocio = new Negocio(req.body);
        let avatar = req.files.avatar;
        let avatar_nombre = null;

        if(avatar){
            let extension = avatar.name.split('.');
            extension = extension[extension.length-1];

            avatar_nombre = `${negocio.nombre}-avatar.${extension}`;
            negocio.avatar = avatar_nombre;
        }

        negocio.save();

        // guardando img
        if(avatar){
            avatar.mv(`./upload_file/negocio/avatar/${avatar_nombre}`, (err) => {

                if(err)
                    res.status(500).send('Error guardando avatar de negocio', err);
    
            });    
        }
        res.status(200).send(`Negocio Creado! \\n \\n ${negocio}`);

    }catch (error){
        
        res.status(500).send(`Se produjo un Error ${error}`);
    
    }
}