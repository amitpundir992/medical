import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer'; // Import multer
import { router } from './routes/user.route.js';
import adminRouter from './routes/admin.route.js'

const app = express();

// Initialize multer
const upload = multer(); // You can customize multer configuration if needed

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: "GET, POST, PUT, DELETE, PATCH",
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Use multer to parse `multipart/form-data` (e.g., form fields)
app.use(upload.none()); // For parsing form fields


// Use the user routes
app.use("/api/v1/users", router);
app.use("/api/v1/admin", adminRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export { app };
