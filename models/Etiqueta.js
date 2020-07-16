const mongoose = require('mongoose');

const EtiquetaSchema = mongoose.Schema({
    nombre_etiqueta:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Etiqueta', EtiquetaSchema);