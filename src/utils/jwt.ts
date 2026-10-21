import jwt from 'jsonwebtoken';

const envSecret = process.env.JWT_SECRET;
if (!envSecret) {
  throw new Error('JWT_SECRET is not set in env variable');
}

const JWT_SECRET: string = envSecret


export interface TokenPayload {
  id: number;
  role: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign({id: payload.id,role: payload.role}, JWT_SECRET, {expiresIn: '7d', algorithm: 'HS256'});
 
};

export const verifyToken = (token: string): TokenPayload | null => {
  try{
    const decoded = jwt.verify(token, JWT_SECRET, {algorithms: ['HS256']});
    if (typeof decoded === 'object' && decoded !== null && 
      typeof decoded.id === 'number' && typeof decoded.role === 'string')
      {
        return {id: decoded.id, role: decoded.role};
      }
      return null;
    }catch{
        return null;
      }
};
