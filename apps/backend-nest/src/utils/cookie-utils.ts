import type { Response } from 'express';

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
}

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'none',
    secure: true,
  });
}
