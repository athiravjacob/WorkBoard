// src/presentation/utils/cookieHelper.ts
import { Response } from 'express';

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie('refreshToken', token, {
    httpOnly: true,    // Shield against XSS
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in prod
    sameSite: 'strict', // Shield against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
};