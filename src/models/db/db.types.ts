export interface IBlogDB {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}
export interface IPostDB {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export interface IUserDB {
  login: string;
  email: string;
  createdAt: string;
  hash: string;
}

export interface ICommentDB {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
}
