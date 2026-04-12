import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        alumni: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        senderModel: {
            type: String,
            enum: ["Student", "Alumni"],
            required: true,
        },
        message: {
            type: String,
            default: "",
        },
        fileUrl: {
            type: String,
            default: "",
        },
        fileName: {
            type: String,
            default: "",
        },
        fileType: {
            type: String,
            default: "",
        },
        cloudinaryId: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

chatMessageSchema.index({ student: 1, alumni: 1, createdAt: 1 });

const ChatMessageModel =
    mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessageModel;
