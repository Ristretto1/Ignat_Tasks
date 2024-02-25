import { Router, Request, Response } from 'express';
import { HTTP_STATUSES } from '../models/common.types';
import { TestsRepository } from '../repositories/tests.repository';

export const testingRouter = Router();

testingRouter.delete('/all-data', (req: Request, res: Response) => {
  TestsRepository.clearAllDB();
  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
