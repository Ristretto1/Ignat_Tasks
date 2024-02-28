import { body } from 'express-validator';
import { inputModelValidation } from '../middlewares/inputModelValidation/inputModelValidation.middleware';
import { userCollection } from '../db/db';

const loginOrEmailValidation = body('loginOrEmail')
  .notEmpty()
  .withMessage('loginOrEmail is required')
  .isString()
  .withMessage('loginOrEmail must be string')
  .trim()
  .isLength({ min: 3 })
  .withMessage('loginOrEmail length must be min: 3');

const passwordValidation = body('password')
  .notEmpty()
  .withMessage('password is required')
  .isString()
  .withMessage('password must be string')
  .trim()
  .isLength({ min: 6 })
  .withMessage('password length must be min: 6');

export const authLoginModelValidation = () => [
  loginOrEmailValidation,
  passwordValidation,
  inputModelValidation,
];
