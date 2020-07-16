const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocioController');
const fileUpload = require('express-fileupload');
const app = express();
const { check } = require('express-validator');

// default options
app.use( fileUpload({ useTempFiles: true }) );

// creacion de negocio: api/negocio/create/
app.post('/create/', 
        [
            check('nombre', 'El nombre del Negocio es obligatorio').not().isEmpty()     
        ],
        negocioController.crearNegocio
);


// ----------- Comentarios ------------------------

// Agregar comentario a un negocio: api/negocio/<id_negocio>/comentario/create/
app.post('/:id_negocio/comentario/create/',
        [
            check('texto', 'El texto del Comentario es obligatorio').not().isEmpty()     
        ], 
        negocioController.agregarComentario
);

// Actualiza un comentario: api/negocio/<id_negocio>/comentario/update/<id_comentario>
app.put('/:id_negocio/comentario/update/:id_comentario',
        [
            check('texto', 'El texto del Comentario es obligatorio').not().isEmpty()     
        ], 
        negocioController.actualizarComentario
);

module.exports = app;