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
                        json({ msg: 'Ya existe un Negocio con el nombre: '+ {nombre} });
        }

        // convert field delivery to boolean
        if(req.body.delivery){
            let delivery = req.body.delivery[0];
            req.body.delivery = delivery == 'true' ? true: false;
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


// ------------------------------------ COMENTARIOS ---------------------------------------------------

exports.agregarComentario = async (req, res) => {
    // Revisa si no hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const negocio = await Negocio.findById(req.params.id_negocio);
        if(!negocio){
            return res.status(404).json({msg:'Negocio no encontrado'});
        }
        
        // push agrega elementos al final del array y retorna la cantidad de elementos del array
        const cantidad = negocio.comentarios.push(req.body);
        await negocio.save();
        res.json({ 
            'msg': 'Comentario agregado con éxito!',
            'comentario': negocio.comentarios[cantidad-1] // cantidad-1 para traer el ultimo elemento
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(`Se produjo un Error ${error}`);
    }
}