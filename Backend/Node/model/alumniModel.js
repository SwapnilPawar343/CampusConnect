import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    skils: {
        type: [String],
        default: []
    },
    Mentor:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Student',
    },
    currentCompany: {
        type: String,
        required: true,
    },
    graduationYear: {
        type: Number,
        required: true,
    },
    bio: {
        type: String,
        default: ''
    },

}, { timestamps: true });
const AlumniModel= mongoose.models.Alumni || mongoose.model('Alumni', alumniSchema);
export default AlumniModel;