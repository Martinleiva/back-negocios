const Negocio = require('../models/Negocio');

exports.crearNegocio = async (req, res) => {
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