import dotenv from 'dotenv';
dotenv.config(); 
const cors = require('cors');
import express from "express";
import cookieParser from 'cookie-parser'; 
import { connectDB } from "./infrastructure/database/connection";
import { masterRouter } from "./presentation/routes";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  // This is your React app's URL
  origin: 'http://localhost:5173', 
  credentials: true, // Required for Cookies/Refresh Tokens
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser()); 
connectDB();

app.use('/api', masterRouter);


app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});

export default app;