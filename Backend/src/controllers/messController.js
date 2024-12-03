import Mess from "../models/Mess.js";

const createMess = async (req, res) => {
    try {
        // Input validation
        if (!req.body.name || !req.body.halls || !req.body.mealTimes) {
          return res.status(400).json({ error: 'Name, halls, and meal times are required.' });
        }
    
        // Ensure halls and mealTimes are arrays
        if (!Array.isArray(req.body.halls) || !Array.isArray(req.body.mealTimes)) {
          return res.status(400).json({ error: 'Halls and meal times should be arrays.' });
        }
    
        // Check for duplicate mess names
        const existingMess = await Mess.findOne({ name: req.body.name });
        if (existingMess) {
          return res.status(400).json({ error: 'A mess with this name already exists.' });
        }
    
        // Create mess
        const mess = await Mess.create(req.body);
        res.status(201).json(mess);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error.' });
      }
};

const updateMess = async (req, res) => {
    try {
        // Validate input
        if (Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'No update data provided.' });
        }
    
        // Check if mess exists
        const mess = await Mess.findById(req.params.id);
        if (!mess) {
          return res.status(404).json({ error: 'Mess not found.' });
        }
    
        // Prevent updating with invalid data
        if (req.body.halls && !Array.isArray(req.body.halls)) {
          return res.status(400).json({ error: 'Halls must be an array.' });
        }
        if (req.body.mealTimes && !Array.isArray(req.body.mealTimes)) {
          return res.status(400).json({ error: 'Meal times must be an array.' });
        }
    
        // Update mess
        const updatedMess = await Mess.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
    
        res.status(200).json(updatedMess);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error.' });
      }
};

export { createMess, updateMess };