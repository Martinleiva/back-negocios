const express = require('express');
const router = express.Router();
const rubroController = require('../controllers/rubroController');
const { check } = require('express-validator');

// creacion de rubro: api/rubro/create/
router.post('/create/', 
        [
            check('nombre', 'El nombre del Rubro es obligatorio').not().isEmpty()     
        ],
        rubroController.crearRubro
);

module.exports = router;