import  { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator';

import { CategoryStore } from '../models/category.model';
import Category from "../types/category.type";


const categoryStore = new CategoryStore();


export const getAll = async (req : Request, res : Response, next: NextFunction) => {

    try {

        const categoryData = await categoryStore.getAll();
        res.json({
            status: 'success',
            data: categoryData || []
          })

    } catch (err) {
        next(err)
      }

}


export const create = async (req : Request, res : Response, next: NextFunction) => {

    try {


      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

        const categoryData: Category = {
          name : req.body.name
        }

        const createCategory = await categoryStore.create(categoryData);
        res.json({
            status: 'success',
            data: createCategory || []
          })

    } catch (err) {
        next(err)
      }

}
