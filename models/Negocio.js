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
    },
    create:{
        type: Date,
        default: Date.now()
    },
    // relaciones con otros modelos
    rubro:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Rubro'
    }
});

module.exports = mongoose.model('Negocio', NegocioSchema);

// Falta campos: Etiquetas, Avatar
