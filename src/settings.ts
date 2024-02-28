import express from 'express';
import { AppRouterPath } from './models/common.types';
import { testingRouter } from './routers/testing.router';
import { blogsRouter } from './routers/blogs.router';
import { postsRouter } from './routers/posts.router';
import { usersRouter } from './routers/users.router';
import { authRouter } from './routers/auth.router';

export const app = express();
app.use(express.json());

app.use(AppRouterPath.testing, testingRouter);
app.use(AppRouterPath.blogs, blogsRouter);
app.use(AppRouterPath.posts, postsRouter);
app.use(AppRouterPath.users, usersRouter);
app.use(AppRouterPath.auth, authRouter);
