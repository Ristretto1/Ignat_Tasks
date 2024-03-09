import request from 'supertest';
import { app } from '../src/settings';
import { AppRouterPath, HTTP_STATUSES } from '../src/models/common.types';
import { ICreateBlog, IUpdateBlog } from '../src/models/blogs/input.types';
import { MongoClient } from 'mongodb';
import { IBlogOutput } from '../src/models/blogs/output.types';
import { createPost } from './testUtils/posts.utils.test';
import { IPostOutput } from '../src/models/posts/output.types';
import { getTokenExistUser } from './testUtils/users.utils.test';
import { ICreateComment, IUpdateComment } from '../src/models/comments/input.types';
import { ICommentOutput } from '../src/models/comments/output.types';
import { createCommentData, createCommentUpdateData } from './testUtils/comments.utils.test';

const route = AppRouterPath.comments;
const uri = process.env.LOCAL_URI || 'mongodb://localhost:27017';

describe(route, () => {
  const client = new MongoClient(uri);
  let post: IPostOutput;
  beforeAll(async () => {
    await client.connect();
    await request(app).delete(`${AppRouterPath.testing}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
    post = await createPost(app);
  });

  afterAll(async () => {
    await request(app).delete(`${AppRouterPath.testing}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
    await client.close();
  });

  it('+ GET all items = []', async () => {
    await request(app).get(`${AppRouterPath.posts}/${post.id}/comments`).expect(HTTP_STATUSES.OK_200, {
      items: [],
      page: 1,
      pagesCount: 0,
      pageSize: 10,
      totalCount: 0
    });
  });

  // // -- INCORRECT ID -- //
  // it('- PUT item with incorrect id', async () => {
  //   const token = await getTokenExistUser(app);
  //   const data: IUpdateComment = {
  //     content: 'new content'
  //   };

  //   await request(app)
  //     .put(`${route}/100`)
  //     .auth(token, { type: 'bearer' })
  //     .send(data)
  //     .expect(HTTP_STATUSES.NOT_FOUND_404);
  // });
  it('- DELETE item with incorrect id', async () => {
    const token = await getTokenExistUser(app);
    await request(app).delete(`${route}/-100`).auth(token, { type: 'bearer' }).expect(HTTP_STATUSES.NOT_FOUND_404);
  });
  it('- GET item with incorrect id', async () => {
    await request(app).get(`${route}/100`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  // // // -- UNAUTH -- //
  it('- DELETE item unauth', async () => {
    await request(app).delete(`${route}/100`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });
  // it('- POST item unauth', async () => {
  //   const data: ICreateBlog = {
  //     description: 'new description',
  //     name: 'new name',
  //     websiteUrl: 'abc@gmail.com'
  //   };

  //   await request(app).post(route).send(data).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  //   await request(app).get(route).expect(HTTP_STATUSES.OK_200, {
  //     items: [],
  //     page: 1,
  //     pagesCount: 0,
  //     pageSize: 10,
  //     totalCount: 0
  //   });
  // });
  it('- PUT item unauth', async () => {
    const data: IUpdateComment = {
      content: 'update content'
    };

    await request(app).put(`${route}/100`).send(data).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  let newItem1: ICommentOutput;
  let newItem2: ICommentOutput;
  let commonToken: string;
  const data1: ICreateComment = createCommentData();
  const data2: ICreateComment = createCommentData();
  it('+ POST first item with correct input data', async () => {
    commonToken = await getTokenExistUser(app);

    const res = await request(app)
      .post(`${AppRouterPath.posts}/${post.id}/comments`)
      .auth(commonToken, { type: 'bearer' })
      .send(data1)
      .expect(HTTP_STATUSES.CREATED_201);

    newItem1 = res.body;

    await request(app)
      .get(`${AppRouterPath.posts}/${post.id}/comments`)
      .expect(HTTP_STATUSES.OK_200, {
        items: [newItem1],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 1
      });
  });
  it('+ POST second item with correct input data', async () => {
    const token = await getTokenExistUser(app);

    const res = await request(app)
      .post(`${AppRouterPath.posts}/${post.id}/comments`)
      .auth(token, { type: 'bearer' })
      .send(data2)
      .expect(HTTP_STATUSES.CREATED_201);

    newItem2 = res.body;

    await request(app)
      .get(`${AppRouterPath.posts}/${post.id}/comments`)
      .expect(HTTP_STATUSES.OK_200, {
        items: [newItem2, newItem1],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 2
      });
  });

  // // -- INCORRECT DATA -- //
  it('- POST item with incorrect data', async () => {
    const data1: ICreateComment = {
      content: ''
    };

    await request(app)
      .post(`${AppRouterPath.posts}/${post.id}/comments`)
      .auth(commonToken, { type: 'bearer' })
      .send(data1)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`${AppRouterPath.posts}/${post.id}/comments`)
      .expect(HTTP_STATUSES.OK_200, {
        items: [newItem2, newItem1],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 2
      });
  });
  it('- PUT fisrt item with incorrect data', async () => {
    const data1: IUpdateComment = {
      content: ''
    };

    await request(app)
      .put(`${route}/${newItem1.id}`)
      .auth(commonToken, { type: 'bearer' })
      .send(data1)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`${AppRouterPath.posts}/${post.id}/comments`)
      .expect(HTTP_STATUSES.OK_200, {
        items: [newItem2, newItem1],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 2
      });
  });

  it('+ GET fisrt item by id', async () => {
    await request(app).get(`${route}/${newItem1.id}`).expect(HTTP_STATUSES.OK_200, newItem1);
  });
  // it('+ PUT fisrt item by id', async () => {
  // const data: IUpdateComment = createCommentUpdateData();

  // await request(app)
  //   .put(`${route}/${newItem1.id}`)
  //   .auth(commonToken, { type: 'bearer' })
  //   .send(data)
  //   .expect(HTTP_STATUSES.NO_CONTENT_204);

  // const res = await request(app).get(`${route}/${newItem1.id}`);
  // const updatedItem = res.body;
  // expect(updatedItem).toEqual({
  //   ...newItem1,
  //   ...data
  // });

  // await request(app)
  //   .get(`${AppRouterPath.posts}/${post.id}/comments`)
  //   .expect(HTTP_STATUSES.OK_200, {
  //     items: [newItem2, { ...newItem1, ...data }],
  //     page: 1,
  //     pagesCount: 1,
  //     pageSize: 10,
  //     totalCount: 2
  //   });
  // });

  it('+ DELETE fisrt item', async () => {
    await request(app)
      .delete(`${route}/${newItem1.id}`)
      .auth(commonToken, { type: 'bearer' })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(`${AppRouterPath.posts}/${post.id}/comments`)
      .expect(HTTP_STATUSES.OK_200, {
        items: [newItem2],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 1
      });
  });
  it('+ DELETE second item', async () => {
    await request(app)
      .delete(`${route}/${newItem2.id}`)
      .auth(commonToken, { type: 'bearer' })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app).get(`${AppRouterPath.posts}/${post.id}/comments`).expect(HTTP_STATUSES.OK_200, {
      items: [],
      page: 1,
      pagesCount: 0,
      pageSize: 10,
      totalCount: 0
    });
  });
});
