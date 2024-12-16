import mongoose from 'mongoose';

const messWorkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    aadharNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    WardenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warden',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isLoggedIn: {
        type: Boolean,
    }
});

export const MessWorker = mongoose.model('MessWorker', messWorkerSchema);

messWorkerSchema.pre('insertMany', async function(next, docs) {
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


messWorkerSchema.methods.generateWorkerToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: 'MessWorker',
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};
