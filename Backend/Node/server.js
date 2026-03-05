
import express from 'express';
import cors from 'cors';
import connectDB from './config/connect.js';
import studentRoutes from './routes/studentRoutes.js';
import alumniRoutes from './routes/alumniRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import 'dotenv/config';
import connectCloudinary from './config/cloudnary.js';
import questionRoutes from './routes/quationAndAnsRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
const app= express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle JSON parsing errors


// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

connectDB();
connectCloudinary();
 
const port= process.env.PORT || 4000;

app.use('/api/students', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/resources', resourceRoutes);


app.use('/',(req,res)=>{
    res.send("api is running");
})
app.listen(
    port,()=>console.log("server is running on port " + port)
);
