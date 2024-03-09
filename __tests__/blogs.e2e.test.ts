import request from 'supertest';
import { app } from '../src/settings';
import { AppRouterPath, HTTP_STATUSES } from '../src/models/common.types';
import { ICreateBlog, IUpdateBlog } from '../src/models/blogs/input.types';
import { MongoClient } from 'mongodb';
import { IBlogOutput } from '../src/models/blogs/output.types';
import { createBlogData, createUpdateBlogData } from './testUtils/blogs.utils.test';

const route = AppRouterPath.blogs;
const uri = process.env.LOCAL_URI || 'mongodb://localhost:27017';

describe(route, () => {
  const client = new MongoClient(uri);

  beforeAll(async () => {
    await client.connect();
    await request(app).delete(`${AppRouterPath.testing}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  afterAll(async () => {
    await request(app).delete(`${AppRouterPath.testing}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
    await client.close();
  });

  it('+ GET all items = []', async () => {
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, {
      items: [],
      page: 1,
      pagesCount: 0,
      pageSize: 10,
      totalCount: 0
    });
  });

  // // // -- INCORRECT ID -- //
  it('- PUT item with incorrect id', async () => {
    const data: IUpdateBlog = createUpdateBlogData();

    await request(app)
      .put(`${route}/-100`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
  it('- DELETE item with incorrect id', async () => {
    await request(app)
      .delete(`${route}/-100`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app).get(route).expect(HTTP_STATUSES.OK_200, {
      items: [],
      page: 1,
      pagesCount: 0,
      pageSize: 10,
      totalCount: 0
    });
  });
  it('- GET item with incorrect id', async () => {
    await request(app).get(`${route}/100`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  // // // -- UNAUTH -- //
  it('- DELETE item unauth', async () => {
    await request(app).delete(`${route}/-100`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, {
      items: [],
      page: 1,
      pagesCount: 0,
      pageSize: 10,
      totalCount: 0
    });
  });
  it('- POST item unauth', async () => {
    const data = createBlogData();

    await request(app).post(route).send(data).expect(HTTP_STATUSES.UNAUTHORIZED_401);
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, {
      items: [],
      page: 1,
      pagesCount: 0,
      pageSize: 10,
      totalCount: 0
    });
  });
  it('- PUT item unauth', async () => {
    const data: IUpdateBlog = createUpdateBlogData();

    await request(app).put(`${route}/-100`).send(data).expect(HTTP_STATUSES.UNAUTHORIZED_401);
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, {
      items: [],
      page: 1,
      pagesCount: 0,
      pageSize: 10,
      totalCount: 0
    });
  });

  let newItem1: IBlogOutput;
  let newItem2: IBlogOutput;
  const data1 = createBlogData();
  const data2 = createBlogData();

  it('+ POST first item with correct input data', async () => {
    const res = await request(app)
      .post(route)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data1)
      .expect(HTTP_STATUSES.CREATED_201);

    newItem1 = res.body;

    expect(newItem1).toEqual({
      id: expect.any(String),
      name: data1.name,
      description: data1.description,
      websiteUrl: data1.websiteUrl,
      isMembership: false,
      createdAt: expect.any(String)
    });
    await request(app)
      .get(route)
      .expect(HTTP_STATUSES.OK_200, {
        items: [newItem1],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 1
      });
  });
  it('+ POST second item with correct input data', async () => {
    const res = await request(app)
      .post(route)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data2)
      .expect(HTTP_STATUSES.CREATED_201);

    newItem2 = res.body;

    expect(newItem2).toEqual({
      id: expect.any(String),
      name: data2.name,
      description: data2.description,
      websiteUrl: data2.websiteUrl,
      isMembership: false,
      createdAt: expect.any(String)
    });
    await request(app)
      .get(route)
      .expect(HTTP_STATUSES.OK_200, {
        items: [newItem2, newItem1],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 2
      });
  });

  // -- INCORRECT DATA -- //
  it('- POST item with incorrect data', async () => {
    const data1: ICreateBlog = {
      description: '',
      name: 'new name',
      websiteUrl: 'abc@gmail.com'
    };

    const data2: ICreateBlog = {
      description: 'new description',
      name: '',
      websiteUrl: 'abc@gmail.com'
    };

    const data3: ICreateBlog = {
      description: 'new description',
      name: 'new name',
      websiteUrl: ''
    };

    await request(app)
      .post(route)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data1)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(route)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data2)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(route)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data3)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .get(route)
      .expect(HTTP_STATUSES.OK_200, {
        items: [newItem2, newItem1],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 2
      });
  });
  it('- PUT fisrt item with incorrect data', async () => {
    const data1: IUpdateBlog = {
      description: '',
      name: 'update name',
      websiteUrl: 'https://update.com'
    };
    const data2: IUpdateBlog = {
      description: 'update description',
      name: '',
      websiteUrl: 'https://update.com'
    };
    const data3: IUpdateBlog = {
      description: 'update description',
      name: 'update name',
      websiteUrl: ''
    };

    await request(app)
      .put(`${route}/${newItem1.id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data1)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .put(`${route}/${newItem1.id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data2)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .put(`${route}/${newItem1.id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data3)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(route)
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
  it('+ PUT fisrt item by id', async () => {
    const data: IUpdateBlog = createUpdateBlogData();

    await request(app)
      .put(`${route}/${newItem1.id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const res = await request(app).get(`${route}/${newItem1.id}`);
    const updatedItem = res.body;
    expect(updatedItem).toEqual({
      ...newItem1,
      ...data
    });

    await request(app)
      .get(route)
      .expect(HTTP_STATUSES.OK_200, {
        items: [
          newItem2,
          {
            ...newItem1,
            ...data
          }
        ],
        page: 1,
        pagesCount: 1,
        pageSize: 10,
        totalCount: 2
      });
  });

  it('+ DELETE fisrt item', async () => {
    await request(app)
      .delete(`${route}/${newItem1.id}`)
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(route)
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
      .set('authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, {
      items: [],
      page: 1,
      pagesCount: 0,
      pageSize: 10,
      totalCount: 0
    });
  });
});
