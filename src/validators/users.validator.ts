import { body } from 'express-validator';
import { inputModelValidation } from '../middlewares/inputModelValidation/inputModelValidation.middleware';
import { userCollection } from '../db/db';

const loginValidation = body('login')
  .notEmpty()
  .withMessage('login is required')
  .isString()
  .withMessage('login must be string')
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('login length must be min: 3, max: 10')
  .matches('^[a-zA-Z0-9_-]*$');
// .custom(async (login) => {
//   const user = await userCollection.find({ login: { $regex: login } });
//   if (user) throw new Error('this login is exist');
//   else return true;
// });

const passwordValidation = body('password')
  .notEmpty()
  .withMessage('password is required')
  .isString()
  .withMessage('password must be string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('password length must be min: 6, max: 20');

const emailValidation = body('email')
  .notEmpty()
  .withMessage('email is required')
  .isString()
  .withMessage('email must be string')
  .trim()
  .isLength({ min: 1 })
  .withMessage('content length must be min: 1')
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
// .custom(async (email) => {
//   const user = await userCollection.find({ email: { $regex: email } });
//   if (user) throw new Error('this email is exist');
//   else return true;
// });

export const usersInputModelValidation = () => [
  loginValidation,
  passwordValidation,
  emailValidation,
  inputModelValidation,
];
