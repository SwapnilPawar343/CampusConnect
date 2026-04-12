import { v2 as cloudinary } from "cloudinary";
import AlumniModel from "../model/alumniModel.js";
import ChatMessageModel from "../model/chatMessageModel.js";
import MentorRequestModel from "../model/mentorRequestModel.js";
import StudentModel from "../model/studentModel.js";

const getFileType = (mimetype = "") => {
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype.startsWith("video/")) return "video";
    if (mimetype.startsWith("audio/")) return "audio";
    if (mimetype === "application/pdf") return "pdf";
    return "other";
};

const getCloudinaryResourceType = (fileType) => {
    if (fileType === "image") return "image";
    if (fileType === "video") return "video";
    if (fileType === "audio") return "video";
    return "raw";
};

const getUserRole = async (userId) => {
    const student = await StudentModel.findById(userId).select("_id");
    if (student) return "Student";

    const alumni = await AlumniModel.findById(userId).select("_id");
    if (alumni) return "Alumni";

    return null;
};

const verifyMentorship = async (studentId, alumniId) => {
    const student = await StudentModel.findById(studentId).select("alumniMentor name");
    if (!student) return { ok: false, message: "Student not found" };

    if (String(student.alumniMentor || "") === String(alumniId)) {
        return { ok: true, student };
    }

    const accepted = await MentorRequestModel.findOne({
        student: studentId,
        alumni: alumniId,
        status: "accepted",
    }).select("_id");

    if (accepted) {
        return { ok: true, student };
    }

    return { ok: false, message: "No active mentorship found" };
};

const buildMessagePayload = (doc) => ({
    _id: doc._id,
    student: doc.student,
    alumni: doc.alumni,
    sender: doc.sender,
    senderModel: doc.senderModel,
    message: doc.message,
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    fileType: doc.fileType,
    createdAt: doc.createdAt,
});

export const getStudentChat = async (req, res) => {
    try {
        const studentId = req.user.id;
        const role = await getUserRole(studentId);
        if (role !== "Student") {
            return res.status(403).json({ message: "Only students can access this chat" });
        }

        const student = await StudentModel.findById(studentId)
            .populate("alumniMentor", "name email currentCompany")
            .select("alumniMentor");

        if (!student?.alumniMentor) {
            return res.status(200).json({ mentor: null, messages: [] });
        }

        const messages = await ChatMessageModel.find({
            student: studentId,
            alumni: student.alumniMentor._id,
        })
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            mentor: student.alumniMentor,
            messages: messages.map(buildMessagePayload),
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load chat", error: error.message });
    }
};

export const sendStudentMessage = async (req, res) => {
    try {
        const studentId = req.user.id;
        const role = await getUserRole(studentId);
        if (role !== "Student") {
            return res.status(403).json({ message: "Only students can send messages here" });
        }

        const student = await StudentModel.findById(studentId).select("alumniMentor");
        if (!student?.alumniMentor) {
            return res.status(400).json({ message: "Mentor not assigned yet" });
        }

        const messageText = String(req.body.message || "").trim();
        if (!messageText && !req.file) {
            return res.status(400).json({ message: "Message or file is required" });
        }

        let fileUrl = "";
        let fileName = "";
        let fileType = "";
        let cloudinaryId = "";

        if (req.file) {
            fileType = getFileType(req.file.mimetype);
            const resourceType = getCloudinaryResourceType(fileType);
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            const uploaded = await cloudinary.uploader.upload(dataURI, {
                resource_type: resourceType,
                folder: "campus-connect-chat",
                use_filename: true,
                unique_filename: true,
            });

            fileUrl = uploaded.secure_url;
            cloudinaryId = uploaded.public_id;
            fileName = req.file.originalname || "attachment";
        }

        const newMessage = await ChatMessageModel.create({
            student: studentId,
            alumni: student.alumniMentor,
            sender: studentId,
            senderModel: "Student",
            message: messageText,
            fileUrl,
            fileName,
            fileType,
            cloudinaryId,
        });

        return res.status(201).json({ message: "Message sent", data: buildMessagePayload(newMessage) });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};

export const getAlumniConversations = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const role = await getUserRole(alumniId);
        if (role !== "Alumni") {
            return res.status(403).json({ message: "Only alumni can access this endpoint" });
        }

        const alumni = await AlumniModel.findById(alumniId).populate("mentees", "name email");
        const mentees = Array.isArray(alumni?.mentees) ? alumni.mentees : [];

        const conversations = await Promise.all(
            mentees.map(async (student) => {
                const lastMessage = await ChatMessageModel.findOne({
                    student: student._id,
                    alumni: alumniId,
                })
                    .sort({ createdAt: -1 })
                    .lean();

                return {
                    student: {
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                    },
                    lastMessage: lastMessage
                        ? {
                              message: lastMessage.message,
                              fileUrl: lastMessage.fileUrl,
                              fileName: lastMessage.fileName,
                              createdAt: lastMessage.createdAt,
                          }
                        : null,
                };
            })
        );

        conversations.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return bTime - aTime;
        });

        return res.status(200).json({ conversations });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load conversations", error: error.message });
    }
};

export const getAlumniChatByStudent = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const role = await getUserRole(alumniId);
        if (role !== "Alumni") {
            return res.status(403).json({ message: "Only alumni can access this endpoint" });
        }

        const { studentId } = req.params;
        const mentorship = await verifyMentorship(studentId, alumniId);
        if (!mentorship.ok) {
            return res.status(403).json({ message: mentorship.message });
        }

        const messages = await ChatMessageModel.find({ student: studentId, alumni: alumniId })
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            student: { _id: mentorship.student._id, name: mentorship.student.name },
            messages: messages.map(buildMessagePayload),
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load chat", error: error.message });
    }
};

export const sendAlumniMessage = async (req, res) => {
    try {
        const alumniId = req.user.id;
        const role = await getUserRole(alumniId);
        if (role !== "Alumni") {
            return res.status(403).json({ message: "Only alumni can send messages here" });
        }

        const { studentId } = req.params;
        const mentorship = await verifyMentorship(studentId, alumniId);
        if (!mentorship.ok) {
            return res.status(403).json({ message: mentorship.message });
        }

        const messageText = String(req.body.message || "").trim();
        if (!messageText && !req.file) {
            return res.status(400).json({ message: "Message or file is required" });
        }

        let fileUrl = "";
        let fileName = "";
        let fileType = "";
        let cloudinaryId = "";

        if (req.file) {
            fileType = getFileType(req.file.mimetype);
            const resourceType = getCloudinaryResourceType(fileType);
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            const uploaded = await cloudinary.uploader.upload(dataURI, {
                resource_type: resourceType,
                folder: "campus-connect-chat",
                use_filename: true,
                unique_filename: true,
            });

            fileUrl = uploaded.secure_url;
            cloudinaryId = uploaded.public_id;
            fileName = req.file.originalname || "attachment";
        }

        const newMessage = await ChatMessageModel.create({
            student: studentId,
            alumni: alumniId,
            sender: alumniId,
            senderModel: "Alumni",
            message: messageText,
            fileUrl,
            fileName,
            fileType,
            cloudinaryId,
        });

        return res.status(201).json({ message: "Message sent", data: buildMessagePayload(newMessage) });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};
