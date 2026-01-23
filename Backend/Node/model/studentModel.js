import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
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
    }

}, { timestamps: true });
const StudentModel= mongoose.models.Student || mongoose.model('Student', studentSchema);
export default StudentModel;