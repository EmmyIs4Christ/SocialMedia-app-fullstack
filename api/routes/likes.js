import express from "express";

import { getLike } from "../controllers/likes.js";

const router = express.Router();

router.get("", getLike);

export default router;
