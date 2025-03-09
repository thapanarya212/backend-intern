const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  professor_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Professor ID is required'] 
  },
  start_time: { 
    type: Date, 
    required: [true, 'Start time is required'] 
  },
  end_time: { 
    type: Date, 
    required: [true, 'End time is required'],
    validate: {
      validator: function(value) {
        return value > this.start_time;
      },
      message: 'End time must be after start time'
    }
  },
  is_booked: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model('Availability', availabilitySchema);