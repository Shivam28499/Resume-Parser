import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import resumeRoutes from './routes/resumeRoutes.js';
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;
app.use('/api/resume', resumeRoutes);

app.listen(PORT,() => {
    console.log("Server is up at port: ",PORT);
})