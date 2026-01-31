import express from "express";

import { addRelationship, deleteRelationship, getRelationships } from "../controllers/relationships.js";

const router = express.Router();

router.get("/", getRelationships);

router.post("/", addRelationship);

router.delete("/", deleteRelationship);

export default router;
