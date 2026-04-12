import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true
    },
    audience: {
        type: String,
        enum: ['alumni', 'student', 'both'],
        default: 'both'
    },
    poster: {
        type: String,
        default: ''
    }
}, { timestamps: true });    
const EventModel = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default EventModel;