import EventModel from "../model/eventModel.js";
import AdminModel from "../model/admineModel.js";
import StudentModel from "../model/studentModel.js";
import AlumniModel from "../model/alumniModel.js";
import bcrypt from 'bcrypt';
import { generateAuthToken } from '../middlewear/auth.js';

// Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Missing email or password" });
        }
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = generateAuthToken(admin);
        res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            admin: { id: admin._id, name: admin.name, email: admin.email }, 
            token 
        });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: "Failed to login", error: error.message });
    }
};

// Create new admin
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new AdminModel({
            name,
            email,
            password: hashedPassword
        });
        const savedAdmin = await newAdmin.save();
        res.status(201).json({ 
            message: "Admin created successfully", 
            admin: { id: savedAdmin._id, name: savedAdmin.name, email: savedAdmin.email } 
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: "Failed to create admin", error: error.message });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await AdminModel.find().select('-password');
        res.status(200).json({ message: "Admins retrieved successfully", admins });
    } catch (error) {
        console.error('Error retrieving admins:', error);
        res.status(500).json({ message: "Failed to retrieve admins", error: error.message });
    }
};

// Delete admin
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await AdminModel.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ message: "Failed to delete admin", error: error.message });
    }
};

// Event functions
const createEvent = async (req, res) => {
    try {
        const { name, description, date, audience, poster } = req.body;
        const newEvent = new EventModel({ name, description, date, audience, poster });
        await newEvent.save();
        res.status(201).json({ event: newEvent });
    } catch (error) {
        res.status(500).json({ message: "Failed to create event", error: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve events", error: error.message });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve students", error: error.message });
    }   
};

const getAllAlumni = async (req, res) => {
    try {
        const alumni = await AlumniModel.find();
        res.status(200).json(alumni);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve alumni", error: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await EventModel.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete event", error: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await StudentModel.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete student", error: error.message });
    }
};

const deleteAlumni = async (req, res) => {
    try {
        const { id } = req.params;
        const alumni = await AlumniModel.findByIdAndDelete(id);
        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }
        res.status(200).json({ message: "Alumni deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete alumni", error: error.message });
    }
};

export { adminLogin, createAdmin, getAllAdmins, deleteAdmin, createEvent, getAllEvents, deleteEvent, getAllStudents, deleteStudent, getAllAlumni, deleteAlumni };