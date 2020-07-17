const Negocio = require('../models/Negocio');
const Etiqueta = require('../models/Etiqueta');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');


// ------------------------------------ NEGOCIO ---------------------------------------------------

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

        // save img
        if(avatar){
            avatar.mv(`./upload_file/negocio/avatar/${avatar_nombre}`, (err) => {

                if(err)
                    res.status(500).send('Error guardando avatar de negocio', err);
    
            });    
        }
        res.status(200).send(`Negocio Creado! \\n \\n ${negocio}`);

    }catch (error){
        console.log(error);
        res.status(500).send(`Se produjo un Error`);
    }
}

exports.actualizarNegocio = async (req, res) => {

    // Error Report
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    try{
        let negocio_update = await Negocio.findById( req.params.id_negocio );

        if (!negocio_update)
            return res.status(400).json({ msg: 'No se encontro el Negocio a actualizar' });    

        // verificate new name not duplicate with name exists (unique)
        if(req.body.nombre){
            let negocio_duplicate = await Negocio.findOne( {nombre:req.body.nombre} );
            
            if(negocio_duplicate._id != negocio_update._id)
                    return res.status(400).
                            json({ msg: `Ya existe un Negocio con el nombre: ${req.body.nombre}` });    
        }

        // new avatar
        let avatar_nombre = null;

        if(req.files && req.files.avatar){
            // eliminar el avatar anterior del negocio
            borrar_avatar(negocio_update.avatar);

            let avatar = req.files.avatar;
            let extension = avatar.name.split('.');
            extension = extension[extension.length-1];
            if(req.body.nombre){                                
                avatar_nombre = `${req.body.nombre}-avatar.${extension}`;
            }
            else
                avatar_nombre = `${negocio_update.nombre}-avatar.${extension}`;

            // upload new avatar
            avatar.mv(`./upload_file/negocio/avatar/${avatar_nombre}`, (err) => {
                if(err) res.status(500).send('Error guardando avatar de negocio', err);
            });
        }


        // fields to update
        let nombre = descripcion = telefonos = delivery = horario_atencion = null;
        let update_fields = {};

        if (req.body.nombre) update_fields['nombre'] = req.body.nombre;
        if (req.body.descripcion) update_fields['descripcion'] = req.body.descripcion;
        if (req.body.telefonos) update_fields['telefonos'] = req.body.telefonos;
        if (req.body.delivery) update_fields['delivery'] = req.body.delivery;
        if (req.body.horario_atencion) update_fields['horario_atencion'] = req.body.horario_atencion;
        if (avatar_nombre) update_fields['avatar'] = avatar_nombre;
        
        await negocio_update.updateOne(
            update_fields,
            (err, result) => {
                if(!err) 
                    res.status(200).send(`Negocio actualizado!`);
                else
                    res.status(500).send(`Se produjo un Error actualizando Negocio`);
            }
        );

    }catch (error){
        console.log(error);
        res.status(500).send(`Se produjo un Error`);
    }

    // functions of Update Negocio
    function borrar_avatar(avatar_url){
        let path_avatar = path.resolve(
            __dirname, 
            `../upload_file/negocio/avatar/${avatar_url}`
        );
        if( fs.existsSync(path_avatar) ){
            console.log(path_avatar);
            fs.unlinkSync(path_avatar);
        }
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
        res.status(500).send(`Se produjo un Error`);
    }
}

exports.actualizarComentario = async (req, res) => {
    // Revisa si no hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { texto } = req.body;
        let negocio = await Negocio.findOne(
            {'_id': req.params.id_negocio, 'comentarios._id': req.params.id_comentario},
            {'comentarios.$': 1 }); // Hago que la consulta me limite a un resultado en el array comentarios
        if(!negocio){
            return res.status(404).json({msg:'Negocio con comentario no encontrado'});
        }

        // Obtengo el objeto comentario y chequeo si tiene texto
        let comentario = negocio.comentarios[0];
        if(texto) comentario.texto = texto;

        await Negocio.findOneAndUpdate({_id: req.params.id_negocio, comentarios: {$elemMatch: {_id: req.params.id_comentario}}},
            {$set: {
                'comentarios.$.texto': comentario.texto
            }}, {'new': true});

        res.json({ 
            'msg': 'Comentario actualizado con éxito!', 
            comentario
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(`Se produjo un Error`);
    }
}

exports.eliminarComentario = async (req, res) => {
    try {
        let negocio = await Negocio.findOne(
            {'_id': req.params.id_negocio, 'comentarios._id': req.params.id_comentario},
            {'comentarios.$': 1 }); // Hago que la consulta me limite a un resultado en el array comentarios
        if(!negocio){
            return res.status(404).json({msg:'Negocio con comentario no encontrado'});
        }

        await Negocio.findByIdAndUpdate(
            req.params.id_negocio, 
            { $pull: { "comentarios": { _id: req.params.id_comentario } } }
        );

        res.json({ 
            'msg': 'Comentario eliminado con éxito!', 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(`Se produjo un Error`);
    }
}


// ------------------------------------ ETIQUETAS ---------------------------------------------------

exports.asociarEtiquetaNegocio = async (req, res) => {
    try {
        const negocio = await Negocio.findById(req.params.id_negocio);
        if(!negocio){
            return res.status(404).json({msg:'Negocio no encontrado'});
        }

        const etiqueta = await Etiqueta.findById(req.params.id_etiqueta);
        if(!etiqueta){
            return res.status(404).json({msg:'Etiqueta no encontrada'});
        }
        
        // addToSet agrega elementos al array sólo si el elemento no está en el array
        // Agrego la etiqueta al array etiquetas en negocio
        negocio.etiquetas.addToSet(etiqueta.id);
        // Agrego el negocio al array negocios en etiqueta
        etiqueta.negocios.addToSet(negocio.id);
        
        await negocio.save();
        await etiqueta.save();
        res.json({ 'msg': `Etiqueta ${etiqueta.nombre_etiqueta} asociada con éxito!`});

    } catch (error) {
        console.log(error);
        res.status(500).send(`Se produjo un Error`);
    }
}