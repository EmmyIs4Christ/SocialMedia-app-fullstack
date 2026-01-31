import express from 'express';
import { getStories } from '../controllers/stories.js';

const router = express.Router();

router.get('/', getStories);

export default router;