import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      default: '',
    },
    description: { type: String, required: false, default: '' },
    onboardingCompleted: { type: Boolean, default: false },
    savedStories: [{ type: Schema.Types.ObjectId, ref: 'stories' }],
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
export const UsersCollection = model('User', usersSchema);
