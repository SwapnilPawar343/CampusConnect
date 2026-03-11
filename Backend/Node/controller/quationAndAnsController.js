import QuationModel from "../model/quationModel.js";
import AnswerModel from "../model/answerModel.js";

// Create a new quation
export const createQuation = async (req, res) => {
    try {
        const { title, description } = req.body;
        const askedBy = req.user.id; // Assuming the user ID is stored in the token
        const newQuation = new QuationModel({ title, description, askedBy });
        await newQuation.save();
        res.status(201).json({message: "Quation Asked successfully", quation: newQuation});
    } catch (error) {
        res.status(500).json({ message: "Failed to create quation", error: error.message });
    }
};

// Get all quations
export const getAllQuations = async (req, res) => {
    try {
        const quations = await QuationModel.find().populate('askedBy').populate({
            path: 'answers',
            populate: { path: 'answeredBy' }
        });
        res.status(200).json(quations);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve quations", error: error.message });
    }
};
// Answer a quation
export const answerQuation = async (req, res) => {
    try {
        const { quationId, content } = req.body;
        const answeredBy = req.user.id; // Assuming the user ID is stored in the token

        const existingAnswer = await AnswerModel.findOne({ quation: quationId, answeredBy });
        if (existingAnswer) {
            return res.status(400).json({ message: "You have already answered this question" });
        }

        const newAnswer = new AnswerModel({ content, quation: quationId, answeredBy });
        await newAnswer.save();
        // Update the quation to include this answer
        await QuationModel.findByIdAndUpdate(quationId, { $push: { answers: newAnswer._id } });
        res.status(201).json({message: "Answer added successfully", answer: newAnswer});
    } catch (error) {
        res.status(500).json({ message: "Failed to answer quation", error: error.message });
    }
};
// Get answers for a specific quation
export const getAnswersForQuation = async (req, res) => {
    try {
        const { quationId } = req.params;
        const answers = await AnswerModel.find({ quation: quationId }).populate('answeredBy');
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve answers", error: error.message });
    }   
};

export const reactToAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const { reaction } = req.body;
        const userId = req.user.id;

        if (!["like", "dislike"].includes(reaction)) {
            return res.status(400).json({ message: "Reaction must be like or dislike" });
        }

        const answer = await AnswerModel.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        const userIdString = String(userId);
        const likedBy = answer.likedBy.map((item) => String(item));
        const dislikedBy = answer.dislikedBy.map((item) => String(item));
        const hasLiked = likedBy.includes(userIdString);
        const hasDisliked = dislikedBy.includes(userIdString);

        answer.likedBy = answer.likedBy.filter((item) => String(item) !== userIdString);
        answer.dislikedBy = answer.dislikedBy.filter((item) => String(item) !== userIdString);

        let currentReaction = null;

        if (reaction === "like" && !hasLiked) {
            answer.likedBy.push(userId);
            currentReaction = "like";
        }

        if (reaction === "dislike" && !hasDisliked) {
            answer.dislikedBy.push(userId);
            currentReaction = "dislike";
        }

        await answer.save();

        res.status(200).json({
            message: "Reaction updated successfully",
            answerId: answer._id,
            currentReaction,
            likes: answer.likedBy.length,
            dislikes: answer.dislikedBy.length
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update reaction", error: error.message });
    }
};

export const MyQuations = async (req, res) => {
    try {
        const studentId= req.user.id;
        const quations = await QuationModel.find({ askedBy: studentId }).populate('askedBy').populate({ path: 'answers', populate: { path: 'answeredBy' } });
        res.status(200).json(quations);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve quations", error: error.message });
    }
};
export const MyAnswers = async (req, res) => {
    try {
        const alumniId= req.user.id;
        const answers = await AnswerModel.find({ answeredBy: alumniId })
            .populate({ path: 'quation', populate: { path: 'askedBy' } })
            .populate('answeredBy');
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve answers", error: error.message });
    }
};
