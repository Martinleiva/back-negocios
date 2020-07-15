const mongoose = require('mongoose');

const RubroSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

module.exports = mongoose.model('Rubro', RubroSchema);

// Falta campos: Rubros/Categoria, Etiquetas, Avatar
