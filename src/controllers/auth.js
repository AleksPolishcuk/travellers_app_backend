import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { createSession } from '../services/auth.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionsCollection } from '../database/models/session.js';
import { refreshUsersSession } from '../services/auth.js';

const setupSession = (res, session) => {
  const isProd = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProd,
  };

  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.cookie('sessionId', session._id, {
    ...cookieOptions,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  const newSession = await createSession(user._id);
  setupSession(res, newSession);

  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const user = await loginUser(req.body);
  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setupSession(res, newSession);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: user,
  });
};

export const logoutUserController = async (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  const clearOptions = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProd,
  };

  res.clearCookie('accessToken', clearOptions);
  res.clearCookie('refreshToken', clearOptions);
  res.clearCookie('sessionId', clearOptions);

  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
  });
};
