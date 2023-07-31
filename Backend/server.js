import express from "express";
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js"; 
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
dotenv.config();

connectDB();

const port = process.env.PORT || 5000;

const allowedOrigin = 'http://localhost:3000'

const app = express();
app.use(cors({
    origin: allowedOrigin,
    credentials: true, // Set to 'true' to allow sending cookies (necessary for HTTP-only cookies)
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Server is ready'));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => (console.log(`server started on port ${port}`)));