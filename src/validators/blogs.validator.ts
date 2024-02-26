import { body } from 'express-validator';
import { inputModelValidation } from '../middlewares/inputModelValidation/inputModelValidation.middleware';

const nameValidator = body('name')
  .notEmpty()
  .withMessage('name is required')
  .isString()
  .withMessage('name must be string')
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('name length must be min: 1, max: 15');

const descriptionValidator = body('description')
  .notEmpty()
  .withMessage('description is required')
  .isString()
  .withMessage('description must be string')
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('description length must be min: 1, max: 500');

const websiteUrlValidator = body('websiteUrl')
  .notEmpty()
  .withMessage('websiteUrl is required')
  .isString()
  .withMessage('websiteUrl must be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('websiteUrl length must be min: 1, max: 100')
  .matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  .withMessage('incorrect websiteUrl');

export const blogsInputModelValidation = () => [
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  inputModelValidation,
];

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

export const postInBlogInputModelValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputModelValidation,
];
