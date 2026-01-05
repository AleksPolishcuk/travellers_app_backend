import { model, Schema } from 'mongoose';

const storySchema = new Schema(
  {
    img: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
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
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
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
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    collation: { locale: 'en', strength: 2 },
  },
);

export const StoriesCollection = model('stories', storySchema, 'stories');
