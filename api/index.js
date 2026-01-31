import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

// IMPORTING ALL ROUTES
import userRoutes from "./routes/users.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import relationshipsRoutes from './routes/relationships.js';
import storiesRoutes from './routes/stories.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, Date.now() + "-" + file.originalname);
  }
})

const upload = multer({ storage: storage })

const app = express();

// USING ALL MIDDLEWARES / ROUTES
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true,
  })
);
app.use('/api/upload', upload.single('file'), (req, res, next) => {
  const file = req.file;
  res.status(201).json(file.filename)
});
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/relationships", relationshipsRoutes);
app.use('/api/stories', storiesRoutes);

// LISTENING TO SERVER
app.listen(8800, () => {
  console.log("Server is serving");
});
