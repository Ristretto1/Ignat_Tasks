import { Router, Request, Response } from 'express';
import { HTTP_STATUSES } from '../models/common.types';
import { db } from '../db/db';
import { IVideoInputCreate, IVideoInputUpdate, IVideoOutput } from '../models/videos/videos.types';

export const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response) => {
  const { videos } = db;
  return res.send(videos);
});

videosRouter.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { videos } = db;

  const video = videos.find((el) => el.id === +id);
  if (!video) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  return res.send(video);
});

videosRouter.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { videos } = db;

  const videoIndex = videos.findIndex((el) => el.id === +id);
  if (videoIndex === -1) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  videos.splice(videoIndex, 1);

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

videosRouter.post('/', (req: Request<unknown, unknown, IVideoInputCreate>, res: Response) => {
  const { videos } = db;
  const { author, availableResolutions, title } = req.body;
  const errors: {
    errorsMessages: {
      message: string;
      field: string;
    }[];
  } = {
    errorsMessages: [],
  };

  if (!author) {
    errors.errorsMessages.push({ message: 'author error', field: 'author' });
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  }
  if (!title) {
    errors.errorsMessages.push({ message: 'title error', field: 'title' });
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  }

  const publicationDate = new Date();
  publicationDate.setDate(publicationDate.getDate() + 1);

  const newVideo: IVideoOutput = {
    title,
    author,
    availableResolutions,
    id: Date.now(),
    canBeDownloaded: false,
    createdAt: new Date().toISOString(),
    publicationDate: publicationDate.toISOString(),
    minAgeRestriction: null,
  };

  videos.push(newVideo);
  return res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

videosRouter.put(
  '/:id',
  (req: Request<{ id: string }, unknown, IVideoInputUpdate>, res: Response) => {
    const { id } = req.params;
    const { videos } = db;
    const {
      author,
      availableResolutions,
      title,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;

    const videoIndex = videos.findIndex((el) => el.id === +id);
    if (videoIndex === -1) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    videos[videoIndex] = {
      ...videos[videoIndex],
      author,
      availableResolutions,
      title,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    };

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);
