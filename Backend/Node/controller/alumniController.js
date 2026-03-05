import AlumniModel from "../model/alumniModel.js";
import bcrypt from 'bcrypt';
import {generateAuthToken} from '../middlewear/auth.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const login = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: "Missing email or password"});
        }
        const alumni = await AlumniModel.findOne({email});
        if(!alumni) {
            return res.status(400).json({message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, alumni.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid email or password"});
        }
        const token = generateAuthToken(alumni);
        res.status(200).json({success: true, message: "Login successful", alumni, token});
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({message: "Failed to login", error: error.message});
    }
};

// Helper function to retrain mentor model
const retrainMentorModel = (alumniId, username, skills, jobRole) => {
    return new Promise((resolve, reject) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const pythonScriptPath = path.join(__dirname, '../..', 'Python/controller/mentorModelUpdate.py');
        
        // Skills should be joined as a single string
        const skillsStr = Array.isArray(skills) ? skills.join(' ') : skills;
        
        const python = spawn('python', [
            pythonScriptPath,
            String(alumniId),
            username,
            skillsStr,
            jobRole
        ]);
        
        let output = '';
        let errorOutput = '';
        
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        python.on('close', (code) => {
            if (code === 0) {
                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (e) {
                    resolve({ success: true, message: 'Model retrained successfully' });
                }
            } else {
                reject(new Error(`Python script failed: ${errorOutput}`));
            }
        });
    });
};

const createAlumni=async(req,res)=>{
    try {
        const {name,email,password,age,department,skils,currentCompany,graduationYear,bio,jobRole}= req.body;
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Missing required fields",
                required: ["name", "email", "password"],
                received: req.body
            });
        }
        // Check if alumni with the same email already exists
        const existingAlumni=await AlumniModel.findOne({email});
        if(existingAlumni){
            return res.status(400).json({message:"Alumni with this email already exists"});
        }
        const hashPassword=await bcrypt.hash(password,10);
        const newAlumni=new AlumniModel({
            name,
            email,
            password: hashPassword,
            age,
            department,
            skils,
            currentCompany,
            graduationYear,
            bio,
        });
        const savedAlumni = await newAlumni.save();
        
        // Retrain mentor model with new alumni
        try {
            const retrainResult = await retrainMentorModel(
                savedAlumni._id,
                name,
                skils || [],
                jobRole || 'Not Specified'
            );
            console.log('Mentor model retrained:', retrainResult);
        } catch (modelError) {
            console.warn('Warning: Failed to retrain mentor model:', modelError.message);
            // Don't fail the registration if model retraining fails
        }
        
        res.status(201).json({message:"Alumni created successfully",alumni:savedAlumni});
    } catch (error) {
        console.error('Error creating alumni:', error);
        res.status(500).json({message:"Failed to create alumni",error:error.message});
    }
};

const profile=async(req,res)=>{
    try {
        const {email}= req.body;
        if(!email){
            return res.status(400).json({message:"Missing email"});
        }
        const alumni= await AlumniModel.findOne({email}).populate('Mentor');
        if(!alumni){
            return res.status(404).json({message:"Alumni not found"});
        }
        res.status(200).json({message:"Alumni profile retrieved successfully",alumni});
    } catch (error) {
        console.error('Error retrieving alumni profile:', error);
        res.status(500).json({message:"Failed to retrieve alumni profile",error:error.message});
    }
};

const updateProfile=async(req,res)=>{
    try {
        const {id}= req.params;
        const {name,email,password,age,department,skils,currentCompany,graduationYear,bio}= req.body;
        const alumni= await AlumniModel.findById(id);
        if(!alumni){
            return res.status(404).json({message:"Alumni not found"});
        }
        alumni.name=name || alumni.name;
        alumni.email=email || alumni.email;
        alumni.password=password || alumni.password;
        alumni.age=age || alumni.age;
        alumni.department=department || alumni.department;
        alumni.skils=skils || alumni.skils;
        alumni.currentCompany=currentCompany || alumni.currentCompany;
        alumni.graduationYear=graduationYear || alumni.graduationYear;
        alumni.bio=bio || alumni.bio;
        await alumni.save();
        res.status(200).json({message:"Alumni profile updated successfully",alumni});
    } catch (error) {
        console.error('Error updating alumni profile:', error);
        res.status(500).json({message:"Failed to update alumni profile",error:error.message});
    }
};

export {login, createAlumni, profile, updateProfile};