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
    fileType: {
        type: String,
        enum: ['image', 'video', 'pdf', 'audio', 'other'],
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'uploadedByModel',
        required: true
    },
    uploadedByModel: {
        type: String,
        required: true,
        enum: ['Alumni', 'Student'],
        default: 'Student'
    }
}, { timestamps: true });

const ResourceModel = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
export default ResourceModel;