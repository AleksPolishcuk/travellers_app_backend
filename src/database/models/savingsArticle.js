import { model, Schema } from 'mongoose';

const savingsArticleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    storyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'stories',
    },
  },
  { timestamps: true, versionKey: false },
);

savingsArticleSchema.index({ userId: 1, storyId: 1 }, { unique: true });

export const SavedArticleCollection = model(
  'savedArticle',
  savingsArticleSchema,
);
