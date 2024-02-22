import { Router, Request, Response } from 'express';
import { HTTPCodeStatuses } from '../common.types';
import { db } from '../db';
import { IVideoInputCreate, IVideoInputUpdate, IVideoOutput } from '../types/videos.types';

export const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response) => {
  const { videos } = db;
  return res.send(videos);
});

videosRouter.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { videos } = db;

  const video = videos.find((el) => el.id === +id);
  if (!video) return res.sendStatus(HTTPCodeStatuses.NOT_FOUND);
  return res.send(video);
});

videosRouter.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { videos } = db;

  const videoIndex = videos.findIndex((el) => el.id === +id);
  if (videoIndex === -1) return res.sendStatus(HTTPCodeStatuses.NOT_FOUND);
  videos.splice(videoIndex, 1);

  return res.sendStatus(HTTPCodeStatuses.NO_CONTENT);
});

videosRouter.post('/', (req: Request<unknown, unknown, IVideoInputCreate>, res: Response) => {
  const { videos } = db;
  const { author, availableResolutions, title } = req.body;

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
  return res.status(HTTPCodeStatuses.CREATED).send(newVideo);
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
    if (videoIndex === -1) return res.sendStatus(HTTPCodeStatuses.NOT_FOUND);

    videos[videoIndex] = {
      ...videos[videoIndex],
      author,
      availableResolutions,
      title,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    };

    return res.sendStatus(HTTPCodeStatuses.NO_CONTENT);
  }
);
