import dotenv from 'dotenv';
dotenv.config(); 

import express from "express";
import cookieParser from 'cookie-parser'; 
import { connectDB } from "./infrastructure/database/connection";
import { masterRouter } from "./presentation/routes";

const PORT = process.env.PORT || 5000;
console.log("Loaded Port:", PORT);

const app = express();
app.use(express.json());
app.use(cookieParser()); 
connectDB();
app.use('/api', masterRouter);

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});

export default app;