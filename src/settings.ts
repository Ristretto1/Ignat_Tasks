import express from 'express';
import { AppRouterPath } from './common.types';

import { videosRouter } from './routers/videos.router';
import { testingRouter } from './routers/testing.router';

export const app = express();
app.use(express.json());

app.use(AppRouterPath.videos, videosRouter);
app.use(AppRouterPath.testing, testingRouter);
