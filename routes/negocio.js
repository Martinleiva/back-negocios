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
)

module.exports = app;