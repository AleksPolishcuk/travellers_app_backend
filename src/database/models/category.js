import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    collation: { locale: 'en', strength: 2 },
    collection: 'travellers.categories',
  },
);

export const CategoryCollection = mongoose.model('Category', categorySchema);
