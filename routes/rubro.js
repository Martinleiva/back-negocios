const express = require('express');
const router = express.Router();
const rubroController = require('../controllers/rubroController');

// creacion de rubro: api/rubro/create/
router.post('/', rubroController.crearRubro)

module.exports = router;