
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator';
import  jwt  from 'jsonwebtoken';

import { UserStore } from '../models/user.model';
import User from "../types/user.type";

const userStore = new UserStore();



export const getAll = async (req : Request, res : Response, next: NextFunction) => {

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

export const login =  async (req: Request, res: Response): Promise<Response|undefined> => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        
        const data = await userStore.authenticate(req.body.username, req.body.password);
        console.log(data);
        if(!data) {
            res.json({'status' : 'success', 'message': 'invalid user data'}).status(401);

        }
        try {
            const token = jwt.sign({ user : data}, process.env.SECRET_TOKEN as unknown as string);

            res.json({'status' : 'success','message' : 'success', 'user': data, 'token' : token});
        } catch (e) {
            console.log('failed to create token');
        }
          
  
      } catch (err) {
          res.status(401)
          res.json(err)
      }

}




export const register =  async (req: Request, res: Response, next: NextFunction): Promise<Response|undefined> => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        
        const userData : User = {
                username : req.body.username,
                password :  req.body.password,
                firstName :  req.body.firstName,
                lastName :  req.body.lastName,
            }

            const userExists = await userStore.getByColumn('username', userData.username) as unknown as User;

            if (userExists != null) {
                res.json({'success' : false, 'message': 'username exists'}).status(422);
                return;

            }

            const data = await userStore.create(userData);

            res.json({'message' : 'success', 'user': data});
  
      } catch (err) {
          next(err);
      }

}



