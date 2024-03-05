import { body } from 'express-validator';
import { inputModelValidation } from '../middlewares/inputModelValidation/inputModelValidation.middleware';

const contentValidator = body('content')
  .notEmpty()
  .withMessage('content is required')
  .isString()
  .withMessage('content must be string')
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage('content length must be min: 20, max: 300');

export const commentsInputModelValidation = () => [contentValidator, inputModelValidation];
