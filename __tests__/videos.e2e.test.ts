import request from 'supertest';
import { app } from '../src/settings';
import dotenv from 'dotenv';
import { AppRouterPath, HTTP_STATUSES } from '../src/models/common.types';
import { IVideo, IVideoInputUpdate } from '../src/models/videos/videos.types';
dotenv.config();

const route = AppRouterPath.videos;

describe(route, () => {
  beforeAll(async () => {
    await request(app)
      .delete(`${AppRouterPath.testing}/all-data`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  afterAll(async () => {
    await request(app)
      .delete(`${AppRouterPath.testing}/all-data`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it('+ GET all items = []', async () => {
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
  });

  it('- PUT item with incorrect id', async () => {
    await request(app).put(`${route}/-100`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });
  it('- DELETE item with incorrect id', async () => {
    await request(app).delete(`${route}/-100`).expect(HTTP_STATUSES.NOT_FOUND_404);
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
  });
  it('- GET item with incorrect id', async () => {
    await request(app).get(`${route}/-100`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  let newItem1: IVideo;
  let newItem2: IVideo;
  it('+ POST first item with correct input data', async () => {
    const res = await request(app)
      .post(route)
      .send({ title: 'title 1', author: 'author 1', availableResolutions: ['P144'] })
      .expect(HTTP_STATUSES.CREATED_201);

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
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, [newItem1]);
  });
  it('+ POST second item with correct input data', async () => {
    const res = await request(app)
      .post(route)
      .send({ title: 'title 2', author: 'author 2', availableResolutions: ['P720'] })
      .expect(HTTP_STATUSES.CREATED_201);

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

    await request(app).get(route).expect(HTTP_STATUSES.OK_200, [newItem1, newItem2]);
  });

  it('+ GET fisrt item by id', async () => {
    await request(app).get(`${route}/${newItem1.id}`).expect(HTTP_STATUSES.OK_200, newItem1);
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
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const res = await request(app).get(`${route}/${newItem1.id}`);
    const updatedItem = res.body;
    expect(updatedItem).toEqual({
      ...newItem1,
      ...updateData,
    });
  });

  it('+ DELETE fisrt item', async () => {
    await request(app).delete(`${route}/${newItem1.id}`).expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, [newItem2]);
  });
  it('+ DELETE second item', async () => {
    await request(app).delete(`${route}/${newItem2.id}`).expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
  });
});
