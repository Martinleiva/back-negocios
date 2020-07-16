const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const etiquetaController = require('../controllers/etiquetaController');

// Crea una etiqueta: api/etiqueta/create/
router.post('/create/',
    [
        check('nombre_etiqueta', 'El nombre de la etiqueta es obligatorio').not().isEmpty()
    ],
    etiquetaController.crearEtiqueta
);

// Obtiene listado de etiquetas: api/etiqueta/
router.get('/',
    etiquetaController.obtenerListadoEtiquetas
);

// Actualiza etiqueta: api/etiqueta/update/<id>
router.put('/update/:id',
    [
        check('nombre_etiqueta', 'El nombre de la etiqueta es obligatorio').not().isEmpty()
    ],
    etiquetaController.actualizarEtiqueta
);

// Elimina etiqueta: api/etiqueta/delete/<id>
router.delete('/delete/:id',
    etiquetaController.eliminarEtiqueta
);

module.exports = router;