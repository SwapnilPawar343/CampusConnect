import mongoose from "mongoose";

const mentorRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    alumni: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const MentorRequestModel = mongoose.models.MentorRequest || mongoose.model('MentorRequest', mentorRequestSchema);
export default MentorRequestModel;
