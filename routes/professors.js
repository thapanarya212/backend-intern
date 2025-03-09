const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const profController = require('../controllers/profController');

router.post('/availability', auth('professor'), profController.addAvailability);
router.delete('/appointments/:id', auth('professor'), profController.cancelAppointment);

module.exports = router;