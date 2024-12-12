import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Define the schema for Student
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    institutionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
      },    
    gender : {
        type : String,
        enum : ["Male" , "Female"],
        required : true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", // Referencing the Admin model
        required: true,
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
    isLoggedIn: {
        type: Boolean,
    }
});

studentSchema.pre("save", async function (next) {
    // Only hash the password if it is new or modified
    if (!this.isModified("password")) return next();
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

studentSchema.pre('insertMany', async function(next, docs) {
    try {
        // Iterate over the documents to hash their passwords
        for (let doc of docs) {
            if (doc.password) { // Check if password is present and modified
                const salt = await bcrypt.genSalt(10);
                doc.password = await bcrypt.hash(doc.password, salt);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});


// Method to generate an authentication token for the student
studentSchema.methods.generateStudentToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

export const Student = mongoose.model("Student", studentSchema);
