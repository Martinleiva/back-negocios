const Rubro = require('../models/Rubro');

exports.crearRubro = async (req, res) => {
    // Error Report
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    }

        // Create rubro
    try{
        const {nombre} = new Rubro(req.body);

        let rubro = await Rubro.findOne({ nombre })
        // verificate 'nombre --> rubro' (unique)
        if ( rubro ){
            return res.status(400).
                        json({ msg: 'Ya existe una etiqueta con el nombre: '+ {nombre} });
        }

        // if all right, create rubro
        rubro = new Rubro(req.body)
        await rubro.save();   
        res.status(200).send('Rubro Creado! \n \n' + rubro);
        
    }catch (error){
        console.log(error);
        res.status(500).send('Se produjo un Error ');
    }
}