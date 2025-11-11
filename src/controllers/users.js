import { UsersCollection } from '../database/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import createHttpError from 'http-errors';

export const getTravellersController = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(limitNumber) ||
      limitNumber < 1
    ) {
      return next(createHttpError(400, 'Invalid pagination parameters'));
    }

    const skip = (pageNumber - 1) * limitNumber;

    const travellers = await UsersCollection.find()
      .skip(skip)
      .limit(limitNumber);

    const totalItems = await UsersCollection.countDocuments();

    const paginationData = calculatePaginationData(
      totalItems,
      limitNumber,
      pageNumber,
    );
    res.status(200).json({
      status: 200,
      message: 'Successfully fetched travellers!',
      data: {
        travellers,
        ...paginationData,
      },
    });
  } catch (error) {
    next(error);
  }
};
