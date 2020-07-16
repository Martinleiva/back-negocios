const mongoose = require('mongoose');


const ComentarioSchema = mongoose.Schema({
    texto:{
        type:String,
        required:true
    },
    created_at: { 
        type: Date,
        default: Date.now()
    }
});


const NegocioSchema = mongoose.Schema({
    nombre:{
        type: String,
        unique: true,
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
    created_at:{
        type: Date,
        default: Date.now()
    },
    avatar:{
        type: String
    },
    // relaciones con otros modelos
    rubro:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Rubro'
    },
    comentarios: {type: [ComentarioSchema]}
});

module.exports = mongoose.model('Negocio', NegocioSchema);

// Falta campos: Etiquetas, Avatar
