import QuationModel from "../model/quationModel";
import AnswerModel from "../model/answerModel";

// Create a new quation
export const createQuation = async (req, res) => {
    try {
        const { title, description, askedBy } = req.body;
        const newQuation = new QuationModel({ title, description, askedBy });
        await newQuation.save();
        res.status(201).json(newQuation);
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
        const { quationId, content, answeredBy } = req.body;
        const newAnswer = new AnswerModel({ content, quation: quationId, answeredBy });
        await newAnswer.save();
        // Update the quation to include this answer
        await QuationModel.findByIdAndUpdate(quationId, { $push: { answers: newAnswer._id } });
        res.status(201).json(newAnswer);
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

export const MyQuations = async (req, res) => {
    try {
        const { studentId } = req.params;
        const quations = await QuationModel.find({ askedBy: studentId }).populate('askedBy').populate({ path: 'answers', populate: { path: 'answeredBy' } });
        res.status(200).json(quations);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve quations", error: error.message });
    }
};
export const MyAnswers = async (req, res) => {
    try {
        const { alumniId } = req.params;
        const answers = await AnswerModel.find({ answeredBy: alumniId }).populate('quation').populate('answeredBy');
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve answers", error: error.message });
    }
};
