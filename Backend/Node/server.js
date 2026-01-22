
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
 const app= express();
 app.use(cors());
 app.use(express.json());
 
const port= process.env.PORT || 4000;

app.use('/',(req,res)=>{
    res.send("api is running");
})
app.listen(
    port,()=>console.log("server is running")
);
