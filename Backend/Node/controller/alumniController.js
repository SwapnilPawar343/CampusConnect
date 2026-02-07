import AlumniModel from "../model/alumniModel";



const createAlumni=async(req,res)=>{
    try {
        const {name,email,password,age,department,skils,currentCompany,graduationYear,bio}= req.body;
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
        const newAlumni=new AlumniModel({
            name,
            email,
            password,
            age,
            department,
            skils,
            currentCompany,
            graduationYear,
            bio,
        });
        await newAlumni.save();
        res.status(201).json({message:"Alumni created successfully",alumni:newAlumni});
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

export {createAlumni,profile,updateProfile};