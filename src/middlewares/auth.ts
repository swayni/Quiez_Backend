import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Erişim yetkiniz yok, token yok.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        (req as any).user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Yetkisiz erişim, token geçersiz.' });
    }
};