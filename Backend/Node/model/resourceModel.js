import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({ 
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni'||'Student',
        required: true
    },


}, { timestamps: true });

const ResourceModel = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
export default ResourceModel;