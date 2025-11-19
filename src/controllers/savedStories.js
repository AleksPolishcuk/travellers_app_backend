import createHttpError from "http-errors";
import { UsersCollection } from "../database/models/user.js";

export const addSavedStoryController = async (req, res) => {
  const userId = req.user._id;
  const { storyId } = req.params;

  const user = await UsersCollection.findById(userId);

  if (!user) throw createHttpError(404, "User not found");

  if (user.savedStories?.includes(storyId)) {
    throw createHttpError(400, "Story already saved");
  }

  user.savedStories.push(storyId);
  await user.save();

  res.status(200).json({
    message: "Story added to saved",
    data: user.savedStories,
  });
};

export const removeSavedStoryController = async (req, res) => {
  const userId = req.user._id;
  const { storyId } = req.params;

  const user = await UsersCollection.findById(userId);

  if (!user) throw createHttpError(404, "User not found");

  user.savedStories = user.savedStories.filter(id => id.toString() !== storyId);

  await user.save();

  res.status(200).json({
    message: "Story removed from saved",
    data: user.savedStories,
  });
};
