const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

router.get('/availability/:professorId', auth('student'), studentController.viewAvailability);
router.post('/appointments', auth('student'), studentController.bookAppointment);
router.get('/appointments', auth('student'), studentController.getAppointments);

module.exports = router;