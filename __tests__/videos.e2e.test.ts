import request from 'supertest';
import { app } from '../src/settings';
import dotenv from 'dotenv';
import { AppRouterPath, HTTPCodeStatuses } from '../src/common.types';
import { IVideo, IVideoInputUpdate } from '../src/types/videos.types';
dotenv.config();

const route = AppRouterPath.videos;

describe(route, () => {
  beforeAll(async () => {
    await request(app)
      .delete(`${AppRouterPath.testing}/all-data`)
      .expect(HTTPCodeStatuses.NO_CONTENT);
  });

  afterAll(async () => {
    await request(app)
      .delete(`${AppRouterPath.testing}/all-data`)
      .expect(HTTPCodeStatuses.NO_CONTENT);
  });

  it('+ GET all items = []', async () => {
    await request(app).get(route).expect(HTTPCodeStatuses.OK, []);
  });

  it('- PUT item with incorrect id', async () => {
    await request(app).put(`${route}/-100`).expect(HTTPCodeStatuses.NOT_FOUND);
  });
  it('- DELETE item with incorrect id', async () => {
    await request(app).delete(`${route}/-100`).expect(HTTPCodeStatuses.NOT_FOUND);
    await request(app).get(route).expect(HTTPCodeStatuses.OK, []);
  });
  it('- GET item with incorrect id', async () => {
    await request(app).get(`${route}/-100`).expect(HTTPCodeStatuses.NOT_FOUND);
  });

  let newItem1: IVideo;
  let newItem2: IVideo;
  it('+ POST first item with correct input data', async () => {
    const res = await request(app)
      .post(route)
      .send({ title: 'title 1', author: 'author 1', availableResolutions: ['P144'] })
      .expect(HTTPCodeStatuses.CREATED);

    newItem1 = res.body;

    expect(newItem1).toEqual({
      id: expect.any(Number),
      title: 'title 1',
      author: 'author 1',
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: ['P144'],
    });
    await request(app).get(route).expect(HTTPCodeStatuses.OK, [newItem1]);
  });
  it('+ POST second item with correct input data', async () => {
    const res = await request(app)
      .post(route)
      .send({ title: 'title 2', author: 'author 2', availableResolutions: ['P720'] })
      .expect(HTTPCodeStatuses.CREATED);

    newItem2 = res.body;

    expect(newItem2).toEqual({
      id: expect.any(Number),
      title: 'title 2',
      author: 'author 2',
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: ['P720'],
    });

    await request(app).get(route).expect(HTTPCodeStatuses.OK, [newItem1, newItem2]);
  });

  it('+ GET fisrt item by id', async () => {
    await request(app).get(`${route}/${newItem1.id}`).expect(HTTPCodeStatuses.OK, newItem1);
  });

  it('+ PUT fisrt item by id', async () => {
    const updateData: IVideoInputUpdate = {
      author: 'updated author',
      availableResolutions: ['P1080'],
      canBeDownloaded: true,
      minAgeRestriction: 12,
      publicationDate: new Date().toISOString(),
      title: 'updated title',
    };

    await request(app)
      .put(`${route}/${newItem1.id}`)
      .send(updateData)
      .expect(HTTPCodeStatuses.NO_CONTENT);

    const res = await request(app).get(`${route}/${newItem1.id}`);
    const updatedItem = res.body;
    expect(updatedItem).toEqual({
      ...newItem1,
      ...updateData,
    });
  });

  it('+ DELETE fisrt item', async () => {
    await request(app).delete(`${route}/${newItem1.id}`).expect(HTTPCodeStatuses.NO_CONTENT);
    await request(app).get(route).expect(HTTPCodeStatuses.OK, [newItem2]);
  });
  it('+ DELETE second item', async () => {
    await request(app).delete(`${route}/${newItem2.id}`).expect(HTTPCodeStatuses.NO_CONTENT);
    await request(app).get(route).expect(HTTPCodeStatuses.OK, []);
  });
});
