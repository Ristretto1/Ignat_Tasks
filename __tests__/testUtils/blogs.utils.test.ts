import request from 'supertest';
import { ICreateBlog } from '../../src/models/blogs/input.types';
import { AppRouterPath, HTTP_STATUSES } from '../../src/models/common.types';

export const createBlogData = (): ICreateBlog => {
  return {
    description: 'new description',
    name: 'new name',
    websiteUrl: 'https://someurl.com'
  };
};

export const createUpdateBlogData = (): ICreateBlog => {
  return {
    description: 'update description',
    name: 'update name',
    websiteUrl: 'https://update.com'
  };
};

export const createBlog = async (app: any) => {
  const res = await request(app)
    .post(AppRouterPath.blogs)
    .set('authorization', 'Basic YWRtaW46cXdlcnR5')
    .send(createBlogData())
    .expect(HTTP_STATUSES.CREATED_201);

  return res.body;
};
