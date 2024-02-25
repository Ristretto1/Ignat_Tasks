export interface IVideo {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: AvailableResolutions[];
}

export interface IVideoOutput extends IVideo {}

export interface IVideoInputCreate {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
}

export interface IVideoInputUpdate {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: string;
}

export type AvailableResolutions =
  | 'P144'
  | 'P240'
  | 'P360'
  | 'P480'
  | 'P720'
  | 'P1080'
  | 'P1440'
  | 'P2160';
