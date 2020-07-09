const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocioController');

// creacion de negocio

// api negocio
router.post('/', negocioController.crearNegocio)

module.exports = router;