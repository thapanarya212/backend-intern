const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

exports.addAvailability = async (req, res) => {
  try {
    const availability = await Availability.create({
      professor_id: req.user.id,
      start_time: req.body.start_time,
      end_time: req.body.end_time
    });
    
    res.status(201).json(availability);
  } catch (error) {
    res.status(400).json({ 
      error: 'Validation failed',
      details: error.message 
    });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    // 1. Find and update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('availability_id');

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    // 2. Update availability slot
    await Availability.findByIdAndUpdate(
      appointment.availability_id._id,
      { is_booked: false }
    );

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(400).json({ 
      error: 'Cancellation failed',
      details: error.message 
    });
  }
};