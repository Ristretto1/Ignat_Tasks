import { NextFunction, Response, Request } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { HTTP_STATUSES, IError, IErrorMessage } from '../../models/common.types';

export const inputModelValidation = (req: Request, res: Response, next: NextFunction) => {
  const formattedErrors = validationResult(req).formatWith(
    (error: ValidationError): IErrorMessage => ({
      message: error.msg,
      field: error.type === 'field' ? error.path : 'unknown',
    })
  );

  if (!formattedErrors.isEmpty()) {
    const errorsMessages = formattedErrors.array({ onlyFirstError: true });
    const errors: IError = {
      errorsMessages,
    };
    return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors);
  } else return next();
};
