import { body } from 'express-validator';
import { BlogRepository } from '../repositories/blogs.repository';
import { inputModelValidation } from '../middlewares/inputModelValidation/inputModelValidation.middleware';

const titleValidation = body('title')
  .notEmpty()
  .withMessage('title is required')
  .isString()
  .withMessage('title must be string')
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('title length must be min: 1, max: 30');

const shortDescriptionValidation = body('shortDescription')
  .notEmpty()
  .withMessage('shortDescription is required')
  .isString()
  .withMessage('shortDescription must be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('shortDescription length must be min: 1, max: 100');

const contentValidation = body('content')
  .notEmpty()
  .withMessage('content is required')
  .isString()
  .withMessage('content must be string')
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('content length must be min: 1, max: 1000');

const blogIdValidation = body('blogId')
  .notEmpty()
  .withMessage('blogId is required')
  .isString()
  .withMessage('blogId must be string')
  .trim()
  .isLength({ min: 1 })
  .withMessage('content length must be min: 1')
  .custom(async (id) => {
    const blog = await BlogRepository.getItemById(id);
    if (!blog) throw new Error('this blogId is not found');
    else return true;
  });

  export const postsInputModelValidation = () => [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputModelValidation,
  ];
