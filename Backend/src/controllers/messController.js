import Mess from "../models/Mess.js";
import Warden from "../models/Warden.js";

const createMess = async (req, res) => {
  try {
    // Input validation
    console.log(res.body)
    if (!req.body.name || !req.body.halls  || !req.body.mealTimes) {
      return res
        .status(400)
        .json({ error: "Name, halls, and meal times are required." });
    }

    // Ensure halls and mealTimes are arrays
    if (!Array.isArray(req.body.halls) || !Array.isArray(req.body.mealTimes)) {
      return res
        .status(400)
        .json({ error: "Halls and meal times should be arrays." });
    }

    const existingMess = await Mess.findOne({
      name: req.body.name,
      WardenId: req.warden._id,
    });

    if (existingMess) {
      return res
        .status(400)
        .json({ error: "You already have a mess with this name." });
    }

    // Create mess
    const mess = await Mess.create({
      ...req.body,
      WardenId: req.warden._id, // Associate mess with the Warden
    });

    await Warden.findByIdAndUpdate(
      req.warden._id,
      { $push: { mess: mess._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Mess created successfully.",
      mess,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// const updateMess = async (req, res) => {
//   try {
//     // Validate input
//     if (Object.keys(req.body).length === 0) {
//       return res.status(400).json({ error: "No update data provided." });
//     }

//     // Check if mess exists
//     const mess = await Mess.findOne({ _id: req.params.id, WardenId: req.warden._id });

//     if (!mess) {
//       return res.status(404).json({ error: "Mess not found." });
//     }

//     // Prevent updating with invalid data
//     if (req.body.halls && !Array.isArray(req.body.halls)) {
//       return res.status(400).json({ error: "Halls must be an array." });
//     }
//     if (req.body.mealTimes && !Array.isArray(req.body.mealTimes)) {
//       return res.status(400).json({ error: "Meal times must be an array." });
//     }

//     // Update mess
//     const updatedMess = await Mess.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Mess updated successfully.",
//       mess: updatedMess,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

const getMess = async (req, res) => {
  try {
    // Fetch all messes associated with the Warden
    const messes = await Mess.find({ WardenId: req.warden._id });

    if (!messes || messes.length === 0) {
      return res.status(404).json({ error: "No messes found for this Warden." });
    }

    res.status(200).json({
      success: true,
      message: "Messes retrieved successfully.",
      messes,
    });
  } catch (err) {
    console.error("Error fetching messes:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getMessById = async (req, res) => {
  try {
    // Extract mess ID from the route parameter
    const { id } = req.params;

    // Find the mess by ID
    const mess = await Mess.findById(id)
    if (!mess) {
      return res.status(404).json({ error: "Mess not found." });
    }

    res.status(200).json({
      success: true,
      message: "Mess details retrieved successfully.",
      mess,
    });
  } catch (err) {
    console.error("Error fetching mess details:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const setMessActive = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and update the mess to set it as active
    const mess = await Mess.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!mess) {
      return res.status(404).json({ error: "Mess not found." });
    }

    res.status(200).json({
      success: true,
      message: "Mess set to active successfully.",
      mess,
    });
  } catch (err) {
    console.error("Error setting mess to active:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

const setMessInactive = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and update the mess to set it as inactive
    const mess = await Mess.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!mess) {
      return res.status(404).json({ error: "Mess not found." });
    }

    res.status(200).json({
      success: true,
      message: "Mess set to inactive successfully.",
      mess,
    });
  } catch (err) {
    console.error("Error setting mess to inactive:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export { createMess, getMess, getMessById, setMessActive, setMessInactive};
