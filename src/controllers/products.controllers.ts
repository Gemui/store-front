import  { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator';

import { ProductStore } from '../models/product.model';
import Product from "../types/product.type";


const productStore = new ProductStore();


export const getAll = async (req : Request, res : Response, next: NextFunction) => {

    try {

        const productData = await productStore.getProductWithCategoryExists(req.body.category_id);
        res.json({
            status: 'success',
            data: productData || []
          })

    } catch (err) {
        next(err)
      }

}

export const getOne = async (req : Request, res : Response, next: NextFunction) => {

    try {

        const productData = await productStore.getByColumn('id',req.params.id as unknown as number);
        if (! productData) {
          return res.status(403).json({ status: 'failed', 'message' : 'Product not found'});
        }
        res.json({
            status: 'success',
            data: productData || {}
          })

    } catch (err) {
        next(err)
      }

}


export const getTop = async (_ : Request, res : Response, next: NextFunction) => {

  try {
      console.log('top')
      const productData = await productStore.topProducts();

      res.json({
          status: 'success',
          data: productData || []
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

        const productData: Product = {
          name : req.body.name,
          category_id : req.body.category_id,
          price : req.body.price,
        }

        const createProduct = await productStore.create(productData);
        res.json({
            status: 'success',
            data: createProduct || []
          })

    } catch (err) {
        next(err)
      }

}
