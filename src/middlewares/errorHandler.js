import { HttpError } from 'http-errors';
import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    let message = err.message;

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large';
    }

    res.status(400).json({
      status: 400,
      message: 'Bad Request',
      data: { message },
    });
    return;
  }

  if (err && err.message === 'Only image files are allowed') {
    res.status(400).json({
      status: 400,
      message: 'Bad Request',
      data: { message: err.message },
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err?.message,
  });
};
