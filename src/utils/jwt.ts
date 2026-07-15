import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in env variable');
}

export interface TokenPayload {
  id: number;
  role: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {expiresIn: '7D'});
  try{
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }catch{
    return null;
  }
}
