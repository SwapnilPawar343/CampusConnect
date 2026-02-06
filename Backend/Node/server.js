
import express from 'express';
import cors from 'cors';
import connectDB from './config/connect.js';
import studentRoutes from './routes/studentRoutes.js';
import 'dotenv/config';
import connectCloudinary from './config/cloudnary.js';
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


app.use('/',(req,res)=>{
    res.send("api is running");
})
app.listen(
    port,()=>console.log("server is running on port " + port)
);
