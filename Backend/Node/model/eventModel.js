import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
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
    location: {
        type: String,
        required: true
    },
    coverUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });    
const EventModel = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default EventModel;