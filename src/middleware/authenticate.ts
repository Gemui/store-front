import jwt from 'jsonwebtoken'

import express, { Request, Response } from 'express'

export function AuthenticatedUser(req : Request, res : Response, next: express.NextFunction) {

    try {
        const authorizationHeader = req.headers.authorization
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1]
            jwt.verify(token, process.env.SECRET_TOKEN as unknown as string) 
            next();
            return;
        }

        res.json({'success' : false, 'message' : 'unauthenticated'}).status(401);


    } catch(e) {
        res.json({'success' : false, 'message' : 'unauthenticated'}).status(401);
    }
}