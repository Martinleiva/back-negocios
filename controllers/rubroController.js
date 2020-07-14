const Rubro = require('../models/Rubro');

exports.crearRubro = async (req, res) => {
    try{
        // Create rubro
        const rubro = new Rubro(req.body);
        await rubro.save();
        
        res.status(200).send('Rubro Creado! \n \n' + rubro);
    }catch (error){
        console.log(error);
        res.status(500).send('Se produjo un Error ');
    }
}