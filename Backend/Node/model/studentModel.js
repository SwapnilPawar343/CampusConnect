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
    },
    Mentor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    jobRecommendate: {
        type: String,
        default: ''
    },
    jobMatchPercent: {
        type: Number,
        default: 0
    },
    mentorName: {
        type: String,
        default: ''
    },
    mentorRole: {
        type: String,
        default: ''
    },
    mentorId: {
        type: String,
        default: ''
    },

}, { timestamps: true });
const StudentModel= mongoose.models.Student || mongoose.model('Student', studentSchema);
export default StudentModel;