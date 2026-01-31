import express from 'express';

import { addPost, deletePost, getPost, getPosts } from '../controllers/posts.js';

const router = express.Router();

router.get('/:id', getPost);

router.get('', getPosts);

router.post('/', addPost);

router.delete('/:postId', deletePost);

export default router;