import express from 'express';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resumeRoutes.js';
const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());

app.use('/api/resume', resumeRoutes);

app.listen(PORT,() => {
    console.log("Server is up at port: ",PORT);
})