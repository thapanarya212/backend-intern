const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

exports.viewAvailability = async (req, res) => {
  try {
    const availabilities = await Availability.find({
      professor_id: req.params.professor_id,
      is_booked: false
    });
    
    res.json(availabilities);
  } catch (error) {
    res.status(400).json({ 
      error: 'Fetch failed',
      details: error.message 
    });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    // 1. Check availability
    const availability = await Availability.findById(req.body.availability_id);
    if (!availability || availability.is_booked) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    // 2. Create appointment
    const appointment = await Appointment.create({
      student_id: req.user.id,
      availability_id: availability._id
    });

    // 3. Mark slot as booked
    availability.is_booked = true;
    await availability.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ 
      error: 'Booking failed',
      details: error.message 
    });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      student_id: req.user.id,
      status: 'booked'
    }).populate('availability_id');
    
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ 
      error: 'Fetch failed',
      details: error.message 
    });
  }
};