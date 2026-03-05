import mongoose from "mongoose";
import ResourceModel from "../model/resourceModel.js";
import { v2 as cloudinary } from 'cloudinary';

// Helper function to determine file type
const getFileType = (mimetype) => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype === 'application/vnd.ms-powerpoint' || 
        mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        return 'ppt';
    }
    if (mimetype === 'application/msword' || 
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return 'docx';
    }
    return 'other';
};

// Helper function to get Cloudinary resource type
const getCloudinaryResourceType = (fileType) => {
    if (fileType === 'image') return 'image';
    if (fileType === 'video') return 'video';
    if (fileType === 'audio') return 'video'; // Cloudinary uses 'video' for audio
    return 'raw'; // For PDFs and other files
};

// Create a new resource with file upload
export const createResource = async (req, res) => {
    try {
        const { title, description} = req.body;
        const uploadedBy = req.user.id; // Assuming user ID is available in req.user after authentication
        // Validate required fields
        console.log('Received resource creation request:', { title, uploadedBy});
        if (!title || !uploadedBy) {
            return res.status(400).json({ 
                message: "Missing required fields", 
                required: ["title", "uploadedBy", "file"] 
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Determine file type
        const fileType = getFileType(req.file.mimetype);
        const resourceType = getCloudinaryResourceType(fileType);

        // Upload to Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            resource_type: resourceType,
            folder: 'campus-connect-resources',
            use_filename: true,
            unique_filename: true
        });

        // Create new resource with Cloudinary URL
        const newResource = new ResourceModel({
            title,
            description: description || '',
            url: uploadResult.secure_url,
            fileType,
            uploadedBy,
            cloudinaryId: uploadResult.public_id
        });

        await newResource.save();
        res.status(201).json({
            success: true,
            message: "Resource uploaded successfully",
            resource: newResource
        });
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ message: "Failed to create resource", error: error.message });
    }
};

// Get all resources
export const getAllResources = async (req, res) => {
    try {
        const resources = await ResourceModel.find();
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve resources", error: error.message });
    }
};
// Get a resource by ID
export const getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json(resource);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve resource", error: error.message });
    }
};
// Update a resource
export const updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, url } = req.body;
        const resource = await ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        resource.title = title || resource.title;
        resource.description = description || resource.description;
        resource.url = url || resource.url;
        await resource.save();
        res.status(200).json(resource);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update resource", error: error.message });
    }
};

//delete resource
export const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await ResourceModel.findById(id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        
        // Delete from Cloudinary if cloudinaryId exists
        if (resource.cloudinaryId) {
            const resourceType = getCloudinaryResourceType(resource.fileType);
            await cloudinary.uploader.destroy(resource.cloudinaryId, { 
                resource_type: resourceType 
            });
        }
        
        await ResourceModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ message: "Failed to delete resource", error: error.message });
    }
};
export const MyResources = async (req, res) => {
    try {
        const { userId } = req.params;
        const resources = await ResourceModel.find({ uploadedBy: userId }).populate('uploadedBy');
        res.status(200).json({ success: true, resources });
    } catch (error) {
        console.error('Error retrieving user resources:', error);
        res.status(500).json({ message: "Failed to retrieve resources", error: error.message });
    }
};