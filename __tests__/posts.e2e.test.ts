// import request from 'supertest';
// import { app } from '../src/settings';
// import { AppRouterPath, HTTP_STATUSES } from '../src/models/common.types';
// import { ICreatePost } from '../src/models/posts/input.types';
// import { IBlogDB } from '../src/models/blogs/blogs.types';
// import { IPostDB } from '../src/models/posts/posts.types';

// const route = AppRouterPath.posts;
// let blog: IBlogDB;

// describe(route, () => {
//   beforeAll(async () => {
//     await request(app)
//       .delete(`${AppRouterPath.testing}/all-data`)
//       .expect(HTTP_STATUSES.NO_CONTENT_204);

//     const res = await request(app)
//       .post(AppRouterPath.blogs)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send({
//         description: 'new description1',
//         name: 'new name1',
//         websiteUrl: 'https://someurl1.com',
//       })
//       .expect(HTTP_STATUSES.CREATED_201);

//     blog = res.body;
//   });

//   afterAll(async () => {
//     await request(app)
//       .delete(`${AppRouterPath.testing}/all-data`)
//       .expect(HTTP_STATUSES.NO_CONTENT_204);
//   });

//   it('+ GET all items = []', async () => {
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
//   });

//   // -- INCORRECT ID -- //
//   it('- PUT item with incorrect id', async () => {
//     const data: ICreatePost = {
//       blogId: blog.id,
//       content: 'new content1',
//       shortDescription: 'new shortDescription1',
//       title: 'new title1',
//     };

//     await request(app)
//       .put(`${route}/-100`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data)
//       .expect(HTTP_STATUSES.NOT_FOUND_404);
//   });
//   it('- DELETE item with incorrect id', async () => {
//     await request(app)
//       .delete(`${route}/-100`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .expect(HTTP_STATUSES.NOT_FOUND_404);
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
//   });
//   it('- GET item with incorrect id', async () => {
//     await request(app).get(`${route}/-100`).expect(HTTP_STATUSES.NOT_FOUND_404);
//   });

//   // -- UNAUTH -- //
//   it('- DELETE item unauth', async () => {
//     await request(app).delete(`${route}/-100`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
//   });
//   it('- POST item unauth', async () => {
//     const data: ICreatePost = {
//       blogId: 'new title',
//       content: 'new content',
//       shortDescription: 'new shortDescription',
//       title: 'new title',
//     };

//     await request(app).post(route).send(data).expect(HTTP_STATUSES.UNAUTHORIZED_401);
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
//   });
//   it('- PUT item unauth', async () => {
//     const data: ICreatePost = {
//       blogId: blog.id,
//       content: 'new content1',
//       shortDescription: 'new shortDescription1',
//       title: 'new title1',
//     };

//     await request(app).put(`${route}/-100`).send(data).expect(HTTP_STATUSES.UNAUTHORIZED_401);
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
//   });

//   let newItem1: IPostDB;
//   let newItem2: IPostDB;
//   const data1: ICreatePost = {
//     blogId: '',
//     content: 'new content1',
//     shortDescription: 'new shortDescription1',
//     title: 'new title1',
//   };
//   const data2: ICreatePost = {
//     blogId: '',
//     content: 'new content2',
//     shortDescription: 'new shortDescription2',
//     title: 'new title2',
//   };

//   it('+ POST first item with correct input data', async () => {
//     data1.blogId = blog.id;
//     const res = await request(app)
//       .post(route)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data1)
//       .expect(HTTP_STATUSES.CREATED_201);

//     newItem1 = res.body;

//     expect(newItem1).toEqual({
//       id: expect.any(String),
//       blogId: blog.id,
//       blogName: blog.name,
//       content: data1.content,
//       shortDescription: data1.shortDescription,
//       title: data1.title,
//     });
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, [newItem1]);
//   });
//   it('+ POST first item with correct input data', async () => {
//     data2.blogId = blog.id;
//     const res = await request(app)
//       .post(route)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data2)
//       .expect(HTTP_STATUSES.CREATED_201);

//     newItem2 = res.body;

//     expect(newItem2).toEqual({
//       id: expect.any(String),
//       blogId: blog.id,
//       blogName: blog.name,
//       content: data2.content,
//       shortDescription: data2.shortDescription,
//       title: data2.title,
//     });
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, [newItem1, newItem2]);
//   });

//   // -- INCORRECT DATA -- //
//   it('- POST item with incorrect data', async () => {
//     const data1: ICreatePost = {
//       blogId: '',
//       content: 'new content2',
//       shortDescription: 'new shortDescription2',
//       title: 'new title2',
//     };
//     const data2: ICreatePost = {
//       blogId: blog.id,
//       content: '',
//       shortDescription: 'new shortDescription2',
//       title: 'new title2',
//     };
//     const data3: ICreatePost = {
//       blogId: blog.id,
//       content: 'new content2',
//       shortDescription: '',
//       title: 'new title2',
//     };
//     const data4: ICreatePost = {
//       blogId: blog.id,
//       content: 'new content2',
//       shortDescription: 'new shortDescription2',
//       title: '',
//     };

//     await request(app)
//       .post(route)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data1)
//       .expect(HTTP_STATUSES.BAD_REQUEST_400);
//     await request(app)
//       .post(route)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data2)
//       .expect(HTTP_STATUSES.BAD_REQUEST_400);
//     await request(app)
//       .post(route)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data3)
//       .expect(HTTP_STATUSES.BAD_REQUEST_400);
//     await request(app)
//       .post(route)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data4)
//       .expect(HTTP_STATUSES.BAD_REQUEST_400);
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, [newItem1, newItem2]);
//   });
//   it('- PUT fisrt item with incorrect data', async () => {
//     const data1: ICreatePost = {
//       blogId: '',
//       content: 'new content2',
//       shortDescription: 'new shortDescription2',
//       title: 'new title2',
//     };
//     const data2: ICreatePost = {
//       blogId: blog.id,
//       content: '',
//       shortDescription: 'new shortDescription2',
//       title: 'new title2',
//     };
//     const data3: ICreatePost = {
//       blogId: blog.id,
//       content: 'new content2',
//       shortDescription: '',
//       title: 'new title2',
//     };
//     const data4: ICreatePost = {
//       blogId: blog.id,
//       content: 'new content2',
//       shortDescription: 'new shortDescription2',
//       title: '',
//     };

//     await request(app)
//       .put(`${route}/${newItem1.id}`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data1)
//       .expect(HTTP_STATUSES.BAD_REQUEST_400);
//     await request(app)
//       .put(`${route}/${newItem1.id}`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data2)
//       .expect(HTTP_STATUSES.BAD_REQUEST_400);
//     await request(app)
//       .put(`${route}/${newItem1.id}`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data3)
//       .expect(HTTP_STATUSES.BAD_REQUEST_400);
//     await request(app)
//       .put(`${route}/${newItem1.id}`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data4)
//       .expect(HTTP_STATUSES.BAD_REQUEST_400);

//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, [newItem1, newItem2]);
//   });

//   it('+ GET fisrt item by id', async () => {
//     await request(app).get(`${route}/${newItem1.id}`).expect(HTTP_STATUSES.OK_200, newItem1);
//   });
//   it('+ PUT fisrt item by id', async () => {
//     const data: ICreatePost = {
//       blogId: blog.id,
//       content: 'new content2',
//       shortDescription: 'new shortDescription2',
//       title: 'new title2',
//     };

//     await request(app)
//       .put(`${route}/${newItem1.id}`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .send(data)
//       .expect(HTTP_STATUSES.NO_CONTENT_204);

//     const res = await request(app).get(`${route}/${newItem1.id}`);
//     const updatedItem = res.body;
//     expect(updatedItem).toEqual({
//       ...newItem1,
//       ...data,
//     });

//     await request(app)
//       .get(route)
//       .expect(HTTP_STATUSES.OK_200, [
//         {
//           ...newItem1,
//           ...data,
//         },
//         newItem2,
//       ]);
//   });

//   it('+ DELETE fisrt item', async () => {
//     await request(app)
//       .delete(`${route}/${newItem1.id}`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .expect(HTTP_STATUSES.NO_CONTENT_204);
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, [newItem2]);
//   });
//   it('+ DELETE second item', async () => {
//     await request(app)
//       .delete(`${route}/${newItem2.id}`)
//       .set('authorization', 'Basic YWRtaW46cXdlcnR5')
//       .expect(HTTP_STATUSES.NO_CONTENT_204);
//     await request(app).get(route).expect(HTTP_STATUSES.OK_200, []);
//   });
// });
