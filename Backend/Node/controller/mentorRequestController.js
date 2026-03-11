import MentorRequestModel from "../model/mentorRequestModel.js";
import StudentModel from "../model/studentModel.js";
import AlumniModel from "../model/alumniModel.js";

// Student requests a mentor
export const requestMentor = async (req, res) => {
    try {
        const { alumniId, message } = req.body;
        const studentId = req.user.id;

        if (!alumniId) {
            return res.status(400).json({ message: "Alumni ID is required" });
        }

        // Check if request already exists
        const existingRequest = await MentorRequestModel.findOne({
            student: studentId,
            alumni: alumniId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A pending request already exists for this alumni" });
        }

        const mentorRequest = new MentorRequestModel({
            student: studentId,
            alumni: alumniId,
            message: message || ''
        });

        await mentorRequest.save();
        await mentorRequest.populate('student');

        res.status(201).json({
            message: "Mentorship request sent successfully",
            request: mentorRequest
        });
    } catch (error) {
        console.error('Error creating mentor request:', error);
        res.status(500).json({ message: "Failed to send mentorship request", error: error.message });
    }
};

// Get pending mentor requests for an alumni
export const getPendingRequests = async (req, res) => {
    try {
        const alumniId = req.user.id;

        const requests = await MentorRequestModel.find({
            alumni: alumniId,
            status: 'pending'
        })
            .populate({
                path: 'student',
                select: 'name email department skils age'
            })
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: "Failed to fetch requests", error: error.message });
    }
};

// Accept mentorship request
export const acceptMentorRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const alumniId = req.user.id;

        const mentorRequest = await MentorRequestModel.findById(requestId);

        if (!mentorRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (mentorRequest.alumni.toString() !== alumniId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Update request status
        mentorRequest.status = 'accepted';
        await mentorRequest.save();

        // Update student's alumni mentor
        await StudentModel.findByIdAndUpdate(
            mentorRequest.student,
            { alumniMentor: alumniId },
            { new: true }
        );

        // Add student to alumni's mentees
        await AlumniModel.findByIdAndUpdate(
            alumniId,
            { $addToSet: { mentees: mentorRequest.student } },
            { new: true }
        );

        await mentorRequest.populate('student');

        res.status(200).json({
            message: "Mentorship request accepted",
            request: mentorRequest
        });
    } catch (error) {
        console.error('Error accepting mentor request:', error);
        res.status(500).json({ message: "Failed to accept request", error: error.message });
    }
};

// Reject mentorship request
export const rejectMentorRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const alumniId = req.user.id;

        const mentorRequest = await MentorRequestModel.findById(requestId);

        if (!mentorRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (mentorRequest.alumni.toString() !== alumniId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Update request status
        mentorRequest.status = 'rejected';
        await mentorRequest.save();

        await mentorRequest.populate('student');

        res.status(200).json({
            message: "Mentorship request rejected",
            request: mentorRequest
        });
    } catch (error) {
        console.error('Error rejecting mentor request:', error);
        res.status(500).json({ message: "Failed to reject request", error: error.message });
    }
};

// Get all mentor requests for a student (to track status)
export const getStudentMentorRequests = async (req, res) => {
    try {
        const studentId = req.user.id;

        const requests = await MentorRequestModel.find({ student: studentId })
            .populate({
                path: 'alumni',
                select: 'name email company jobRole'
            })
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching student mentor requests:', error);
        res.status(500).json({ message: "Failed to fetch requests", error: error.message });
    }
};

// Get alumni mentees count
export const getMenteesCount = async (req, res) => {
    try {
        const alumniId = req.user.id;

        const alumni = await AlumniModel.findById(alumniId).select('mentees');

        const menteesCount = alumni?.mentees?.length || 0;

        res.status(200).json({ menteesCount });
    } catch (error) {
        console.error('Error fetching mentees count:', error);
        res.status(500).json({ message: "Failed to fetch mentees count", error: error.message });
    }
};
