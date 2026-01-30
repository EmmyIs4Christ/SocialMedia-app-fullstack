import express from 'express';

import { addPost, getPost, getPosts } from '../controllers/posts.js';

const router = express.Router();

router.get('/:id', getPost);

router.get('', getPosts);

router.post('/', addPost)

export default router;