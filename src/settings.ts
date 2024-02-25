import express from 'express';
import { AppRouterPath } from './models/common.types';
import { videosRouter } from './routers/videos.router';
import { testingRouter } from './routers/testing.router';
import { blogsRouter } from './routers/blogs.router';
import { postsRouter } from './routers/posts.router';

export const app = express();
app.use(express.json());

app.use(AppRouterPath.videos, videosRouter);
app.use(AppRouterPath.testing, testingRouter);
app.use(AppRouterPath.blogs, blogsRouter);
app.use(AppRouterPath.posts, postsRouter);
