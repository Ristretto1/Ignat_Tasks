import { Router, Request, Response } from 'express';
import { HTTPCodeStatuses } from '../common.types';
import { db } from '../db';

export const testingRouter = Router();

testingRouter.delete('/all-data', (req: Request, res: Response) => {
  db.videos.length = 0;
  return res.sendStatus(HTTPCodeStatuses.NO_CONTENT);
});
