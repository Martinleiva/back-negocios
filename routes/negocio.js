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

// update negocio: api/negocio/update/<id_negocio>
app.put('/update/:id_negocio', negocioController.actualizarNegocio);



// ------------------------------- COMENTARIOS ------------------------------------

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

// Elimina un comentario: api/negocio/<id_negocio>/comentario/delete/<id_comentario>
app.delete('/:id_negocio/comentario/delete/:id_comentario',
        negocioController.eliminarComentario
);


// ------------------------------- ETIQUETAS ------------------------------------
// Asocia una etiqueta a un negocio: api/negocio/<id_negocio>/etiqueta/associate/<id_etiqueta>
app.post('/:id_negocio/etiqueta/associate/:id_etiqueta',
        negocioController.asociarEtiquetaNegocio
);

module.exports = app;