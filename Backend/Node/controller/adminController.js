import EventModel from "../model/eventModel";

const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, coverUrl } = req.body;
        const newEvent = new EventModel({ title, description, date, location, coverUrl });
        await newEvent.save();
        res.status(201).json(newEvent);
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
        const event = await Event
            .findByIdAndDelete(id);
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

export { createEvent, getAllEvents, deleteEvent, getAllStudents, deleteStudent, getAllAlumni, deleteAlumni };