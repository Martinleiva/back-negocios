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

module.exports = router;