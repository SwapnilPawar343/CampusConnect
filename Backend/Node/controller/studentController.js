import StudentModel from "../model/studentModel.js";
import bcrypt from 'bcrypt';

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
        await newStudent.save();
        res.status(201).json({message:"Student created successfully",student:newStudent});
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
        const alumni = await AlumniModel.findOne({email});
        if(alumni!==null){

        }
        if(!student){
            return res.status(400).json({message:"Invalid email or password"});
        }   
        const isMatch= await bcrypt.compare(password,student.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }
        res.status(200).json({message:"Login successful",student});
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

  export {createStudent, login, profile, updateProfile};