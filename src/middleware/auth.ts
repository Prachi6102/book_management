import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { userToken, AuthenticatedRequest } from '../interface';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY: string = process.env.SECRET_KEY || '';

const authUser = (req: Request, res: Response, next: NextFunction): void => {
    const token: string = req.headers.user as string;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized - Token missing' });
        return;
    }

    try {
        const decoded: JwtPayload = jwt.verify(token, SECRET_KEY) as JwtPayload;
        const user: userToken = decoded as userToken;
        (req as AuthenticatedRequest).user = user;
        next();
    } catch (error: any) {
        res.status(403).json({ message: 'Invalid token' })
    }
};

const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user: userToken | undefined = (req as AuthenticatedRequest).user as userToken;
        if (!user || !user.role || !roles.includes(user.role)) {
            res.status(403).json({ message: 'Unauthorized action!!' });
        }
        next();
    };
};

export { authUser, authorize, AuthenticatedRequest };

