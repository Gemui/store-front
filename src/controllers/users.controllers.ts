
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator';
import  jwt  from 'jsonwebtoken';

import { UserStore } from '../models/user.model';
import User from "../types/user.type";

const userStore = new UserStore();



export const getOne = async (req : Request, res : Response, next: NextFunction) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        const userData = await userStore.getByColumn('id',req.params.id);
        res.json({
            status: 'success',
            data: userData
          })

    } catch (err) {
        next(err)
      }

}

export const getAll = async (_ : Request, res : Response, next: NextFunction) => {

    try {

        const userData = await userStore.getAll();
        res.json({
            status: 'success',
            data: userData || []
          })

    } catch (err) {
        next(err)
      }

}

export const login =  async (req: Request, res: Response, next : NextFunction): Promise<Response|void> => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        
        const data = await userStore.authenticate(req.body.username, req.body.password);
        if(!data) {
            return res.status(401).json({'status' : 'failed', 'message': 'invalid user data'});

        }
        try {
            const token = jwt.sign({ user : data}, process.env.SECRET_TOKEN as unknown as string);

            res.json({'status' : 'success', 'user': data, 'token' : token});
        } catch (e) {
            res.status(401).json({'status' : 'failed','message' : 'invalid data'});
        }
          
  
      } catch (err) {
          next(err);
      }

}




export const register =  async (req: Request, res: Response, next: NextFunction): Promise<Response|void> => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        const userData : User = {
                username : req.body.username,
                password :  req.body.password,
                firstname :  req.body.firstname,
                lastname :  req.body.lastname,
            }

            const userExists = await userStore.getByColumn('username', userData.username) as unknown as User;

            if (userExists != null) {
                res.json({'status' : 'failed', 'message': 'username exists'}).status(422);
                return;

            }

            const data = await userStore.create(userData);
            res.json({'status' : 'success', 'user': data});
  
      } catch (err) {
          next(err);
      }

}



