exports.validateAvailability = (req, res, next) => {
    const { start_time, end_time } = req.body;
    
    if (!start_time || !end_time) {
      return res.status(400).json({ error: 'Missing time fields' });
    }
  
    if (new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
  
    next();
  };