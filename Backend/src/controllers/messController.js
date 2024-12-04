import Mess from "../models/Mess.js";
import Admin from "../models/Admin.js";

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
      adminId: req.admin._id,
    });

    if (existingMess) {
      return res
        .status(400)
        .json({ error: "You already have a mess with this name." });
    }

    // Create mess
    const mess = await Mess.create({
      ...req.body,
      adminId: req.admin._id, // Associate mess with the admin
    });

    await Admin.findByIdAndUpdate(
      req.admin._id,
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
//     const mess = await Mess.findOne({ _id: req.params.id, adminId: req.admin._id });

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
    // Fetch all messes associated with the admin
    const messes = await Mess.find({ adminId: req.admin._id });

    if (!messes || messes.length === 0) {
      return res.status(404).json({ error: "No messes found for this admin." });
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

export { createMess, getMess };
