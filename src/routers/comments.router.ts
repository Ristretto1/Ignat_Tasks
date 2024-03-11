import { Router, Request, Response } from 'express';
import { HTTP_STATUSES, RequestWithParams, RequestWithParamsAndBody } from '../models/common.types';
import { ObjectId } from 'mongodb';
import { CommentQueryRepository } from '../repositories/comments/comments.query.repo';
import { CommentRepository } from '../repositories/comments/comments.repository';
import { CommentService } from '../services/comments.service';
import { ICommentOutput } from '../models/comments/output.types';
import { IUpdateComment } from '../models/comments/input.types';
import { commentsInputModelValidation } from '../validators/comments.validator';
import { authTokenMiddleware } from '../middlewares/auth/auth.middleware';

export const commentsRouter = Router();

commentsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<ICommentOutput>) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

  const comment = await CommentQueryRepository.getCommentById(id);
  if (comment) return res.send(comment);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

commentsRouter.delete('/:id', authTokenMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

  //TODO: перенести это в сервис
  const comment = await CommentQueryRepository.getCommentById(id);
  if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  if (comment.commentatorInfo.userId !== userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);

  const isDeleted = await CommentService.removeCommentById(id);
  if (isDeleted) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

commentsRouter.put(
  '/:id',
  authTokenMiddleware,
  commentsInputModelValidation(),
  async (req: RequestWithParamsAndBody<{ id: string }, IUpdateComment>, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    const { userId } = req;
    if (!ObjectId.isValid(id)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    //TODO: перенести это в сервис
    const comment = await CommentQueryRepository.getCommentById(id);
    if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    if (comment.commentatorInfo.userId !== userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);

    const isUpdated = await CommentService.updateCommentById(id, { content });
    if (isUpdated) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    else return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
);
