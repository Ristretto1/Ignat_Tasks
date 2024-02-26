export interface ICreateBlog {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface IUpdateBlog {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface ICreatePostByBlogId {
  title: string;
  shortDescription: string;
  content: string;
}
