import { IVideo } from './types/videos.types';

export const db: { videos: IVideo[] } = {
  videos: [
    {
      id: 0,
      title: 'example title',
      author: 'example author',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: '2024-02-21T16:18:22.419Z',
      publicationDate: '2024-02-21T16:18:22.419Z',
      availableResolutions: ['P144'],
    },
  ],
};
