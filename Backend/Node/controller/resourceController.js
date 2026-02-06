import mongoose from "mongoose";
import ResourceModel from "../model/resourceModel.js";

// Create a new resource

export const createResource = async (req, res) => {
    try {
        const { title, description, url } = req.body;
        const newResource = new ResourceModel({ title, description, url });
        await newResource.save();
        res.status(201).json(newResource);
    } catch (error) {
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
        await resource.remove();
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete resource", error: error.message });
    }
};
export const MyResources = async (req, res) => {
    try {
        const { studentId } = req.params;
        const resources = await ResourceModel.find({ createdBy: studentId })||await ResourceModel.find({ createdBy: alumniId }).populate('createdBy');
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve resources", error: error.message });
    }
};