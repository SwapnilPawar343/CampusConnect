import mongoose from "mongoose";

const answersSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    quation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quation',
        required: true
    },
    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    }
}, { timestamps: true });
const AnswerModel = mongoose.models.Answer || mongoose.model('Answer', answersSchema);
export default AnswerModel;