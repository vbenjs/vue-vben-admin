import jwt from 'jsonwebtoken';

import { UserInfo } from './mock-data';

export interface UserPayload extends UserInfo {
  iat: number;
  exp: number;
}

export function generateAccessToken(user: UserInfo) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

export function generateRefreshToken(user: UserInfo) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

export function verifyAccessToken(
  token: string,
): null | Omit<UserInfo, 'password'> {
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    ) as UserPayload;

    const userId = decoded.id;
    const user = MOCK_USERS.find((item) => item.id === userId);
    const { password: _pwd, ...userinfo } = user;
    return userinfo;
  } catch {
    return null;
  }
}
