import StudentModel from "../model/studentModel.js";
import bcrypt from 'bcryptjs';

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
  export {createStudent};