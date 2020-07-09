const mongoose = require('mongoose');

const NegocioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    descripcion:{
        type: String,
        trim: true
    },
    telefonos:{
        type: String,
        trim: true
    },
    delivery:{
        type: Boolean,
        default: false,
    },
    horario_atencion:{
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Negocio', NegocioSchema);

// Falta campos: Rubros/Categoria, Etiquetas, Avatar
