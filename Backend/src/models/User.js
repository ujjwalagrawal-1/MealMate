import mongoose from "mongoose";
import bcrypt from "bcrypt"

// Define the schema for User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["Student", "Administrator", "MessWorker"], // Specify the roles
        required: true,
    },
    institutionId: {
        type: String,
        required: function () {
            return this.role === "Student";
        },
        unique: function () {
            return this.role === "Student";
        },
        trim: true,
    },
    aadharCard: {
        type: String,
        required: function () {
            return this.role === "MessWorker";
        },
        unique: function () {
            return this.role === "MessWorker";
        },
        // validate: {
        //     validator: function (value) {
        //         return this.role !== "MessWorker" || /^\d{12}$/.test(value); // Validate Aadhar for Mess Workers
        //     },
        //     message: "Aadhar Card must be a 12-digit number!",
        // },
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords do not match!",
        },
    },
});

// Pre-save hook to hash the password before saving
// userSchema.pre("save", async function (next) {
//     // Only hash the password if it is new or modified
//     if (!this.isModified("password")) return next();
//     try {
//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         // No need to store confirmPassword in the database
//         this.confirmPassword = undefined;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// Export the model
module.exports = mongoose.model("User", userSchema);
