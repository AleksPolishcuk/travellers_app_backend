import { model, Schema } from 'mongoose';
import { CATEGORIES } from '../../constants/index.js';

const storiesSchema = new Schema(
  {
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      required: true,
    },
    fullText: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    date: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
      },
    },
  },
  { timestamps: true, versionKey: false },
);

export const StoriesCollection = model('stories', storiesSchema);
