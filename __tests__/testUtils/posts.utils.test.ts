import request from 'supertest';
import { AppRouterPath, HTTP_STATUSES } from '../../src/models/common.types';
import { ICreatePost } from '../../src/models/posts/input.types';
import { createBlog } from './blogs.utils.test';

export const createPostData = async (app: any): Promise<ICreatePost> => {
  const blog = await createBlog(app);

  return {
    blogId: blog.id,
    content: 'new content',
    shortDescription: 'new shortDescription',
    title: 'new title'
  };
};

export const createPost = async (app: any) => {
  const data = await createPostData(app);
  const res = await request(app)
    .post(AppRouterPath.posts)
    .set('authorization', 'Basic YWRtaW46cXdlcnR5')
    .send(data)
    .expect(HTTP_STATUSES.CREATED_201);

  return res.body;
};
