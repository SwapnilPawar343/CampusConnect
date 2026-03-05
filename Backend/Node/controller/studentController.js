import StudentModel from "../model/studentModel.js";
import bcrypt from 'bcrypt';
import { generateAuthToken } from '../middlewear/auth.js';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const createStudent=async(req,res)=>{
    try {
        // Log incoming request body for debugging
      
        const {name,email,password,age,department,skils}= req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Missing required fields",
                required: ["name", "email", "password"],
                received: req.body
            });
        }
        const hashPassword=await bcrypt.hash(password,10);
        // Check if student with the same email already exists
        const existingStudent=await StudentModel.findOne({email});
        if(existingStudent){
            return res.status(400).json({message:"Student with this email already exists"});
        }
        
        const newStudent=new StudentModel({
            name,
            email,
            password: hashPassword,
            age,
            department,
            skils,
        });
        const token= generateAuthToken(newStudent);
        await newStudent.save();
        res.status(201).json({message:"Student created successfully",student:newStudent,token});
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({message:"Failed to create student",error:error.message});
    }
};
const login =async(req,res)=>{
    try {
        const {email,password}= req.body;   
        if(!email || !password){
            return res.status(400).json({message:"Missing email or password"});
        }   
        const student= await StudentModel.findOne({email});
        if(!student){
            return res.status(400).json({message:"Invalid email or password"});
        }   
        const isMatch= await bcrypt.compare(password,student.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token= generateAuthToken(student);
        console.log('Login successful for student:', student);
        res.status(200).json({success: true, message:"Login successful", student, token});
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({message:"Failed to login",error:error.message});
    }
};
const profile=async(req,res)=>{
    try {
        const {email}= req.body;
        if(!email){
            return res.status(400).json({message:"Missing email"});
        }
        const student= await StudentModel.findOne({email}).populate('Mentor');
        if(!student){
            return res.status(404).json({message:"Student not found"});
        }
        res.status(200).json({message:"Profile retrieved successfully",student});
    } catch (error) {
        console.error('Error retrieving profile:', error);
        res.status(500).json({message:"Failed to retrieve profile",error:error.message});
    }
};
const updateProfile=async(req,res)=>{
    try {
        const {id}= req.params;
        const {name,email,age,department,skils}= req.body;
        const updatedStudent= await StudentModel.findByIdAndUpdate(id,{name,email,age,department,skils},{new:true});
        if(!updatedStudent){
            return res.status(404).json({message:"Student not found"});
        }
        res.status(200).json({message:"Profile updated successfully",student:updatedStudent});
    }
        catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({message:"Failed to update profile",error:error.message});
    }
};

const jobRecommendation = async (req, res) => {
    try {
        const { skills } = req.body;
        if (!skills || (Array.isArray(skills) && skills.length === 0)) {
            return res.status(400).json({ message: "Missing skills" });
        }
        const skillsArg = Array.isArray(skills) ? skills.join(",") : String(skills);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const scriptPath = path.resolve(__dirname, "..", "..", "Python", "controller", "predictsJob.py");
        const pythonCmd = process.env.PYTHON_BIN || "python";

        execFile(pythonCmd, [scriptPath, skillsArg], (error, stdout, stderr) => {
            if (error) {
                console.error("Python error:", stderr || error.message);
                return res.status(500).json({ message: "Failed to get job recommendation" });
            }

            let job;
            try {
                job = JSON.parse(stdout);
            } catch (parseError) {
                console.error("Invalid Python output:", stdout, parseError);
                return res.status(500).json({ message: "Invalid recommendation output" });
            }

            if (job && job.error) {
                return res.status(400).json({ message: job.error });
            }

            if (job && Array.isArray(job.results)) {
                return res.status(200).json({ results: job.results });
            }

            return res.status(200).json({ job });
        });
    } catch (error) {
        console.error("Error getting job recommendation:", error);
        res.status(500).json({ message: "Failed to get job recommendation", error: error.message });
    }
};
const jobRecommended = async (req, res) => {
    try {
        const { studentId, job, job_title, match, match_percent } = req.body;

        if (!studentId) {
            return res.status(400).json({ message: "Missing studentId" });
        }

        const selectedJob = job || job_title;
        if (!selectedJob) {
            return res.status(400).json({ message: "Missing job recommendation" });
        }

        const selectedMatch = Number(match_percent ?? match ?? 0);

        const updatedStudent = await StudentModel.findByIdAndUpdate(
            studentId,
            {
                jobRecommendate: selectedJob,
                jobMatchPercent: selectedMatch,
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Job recommendation updated successfully",
            student: updatedStudent,
        });
    } catch (error) {
        console.error('Error updating job recommendation:', error);
        res.status(500).json({ message: "Failed to update job recommendation", error: error.message });
    }
};
const saveMentor = async (req, res) => {
    try {
        const { studentId, mentorName, mentorRole, mentorId } = req.body;

        if (!studentId) {
            return res.status(400).json({ message: "Missing studentId" });
        }

        if (!mentorName) {
            return res.status(400).json({ message: "Missing mentor name" });
        }

        const updatedStudent = await StudentModel.findByIdAndUpdate(
            studentId,
            {
                mentorName,
                mentorRole: mentorRole || '',
                mentorId: mentorId || '',
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Mentor saved successfully",
            student: updatedStudent,
        });
    } catch (error) {
        console.error('Error saving mentor:', error);
        res.status(500).json({ message: "Failed to save mentor", error: error.message });
    }
};

export {createStudent, login, profile, updateProfile, jobRecommendation, jobRecommended, saveMentor};