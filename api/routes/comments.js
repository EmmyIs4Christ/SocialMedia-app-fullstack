import express from "express";

import { addcomment, getComments } from "../controllers/comments.js";

const router = express.Router();

router.get("/", getComments);

router.post('/', addcomment);

export default router;
