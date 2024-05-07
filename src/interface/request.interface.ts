import { Request } from 'express';
import { userToken } from './token.interface';

export interface AuthenticatedRequest extends Request {
    user: userToken;
}