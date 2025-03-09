const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  student_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Student ID is required'] 
  },
  availability_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Availability', 
    required: [true, 'Availability ID is required'] 
  },
  status: { 
    type: String, 
    enum: ['booked', 'cancelled'], 
    default: 'booked' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);