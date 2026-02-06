import mongoose from "mongoose";

const quationsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }]
}, { timestamps: true });
const QuationModel = mongoose.models.Quation || mongoose.model('Quations', quationsSchema);
export default QuationModel;