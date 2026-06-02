
import express from 'express';
import cors from 'cors';
import connectDB from './config/connect.js';
import studentRoutes from './routes/studentRoutes.js';
import alumniRoutes from './routes/alumniRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import mentorRequestRoutes from './routes/mentorRequestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import 'dotenv/config';
import connectCloudinary from './config/cloudnary.js';
import questionRoutes from './routes/quationAndAnsRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
const app= express();

// Middleware
app.use(cors());
// Increase JSON and URL-encoded payload size limits to allow larger requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle JSON parsing errors


// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
 
const port= process.env.PORT || 4000;

app.use('/api/students', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentor-requests', mentorRequestRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);


app.use('/',(req,res)=>{
    res.send("api is running");
})
// Error handler for oversized payloads
app.use((err, req, res, next) => {
    if (err && (err.type === 'entity.too.large' || err.status === 413)) {
        return res.status(413).json({ message: 'Payload too large. Increase server limits or send smaller payloads.' });
    }
    next(err);
});

const startServer = async () => {
    try {
        await connectDB();
        connectCloudinary();
        app.listen(port, () => console.log("server is running on port " + port));
    } catch (error) {
        console.error('Server startup aborted because the database connection failed.');
        process.exit(1);
    }
};

startServer();
