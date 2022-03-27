import { body, checkSchema } from "express-validator";
import { CategoryStore } from "../models/category.model";

const categoryStore = new CategoryStore();
export class CategoryRequestValidator {

    public validateCreate = [
        body('name', 'category name is required').exists().bail().notEmpty().bail().custom(async (value) => {
            const isCategoryExists = await categoryStore.getByColumn('name',value);
            if(isCategoryExists) {
                return Promise.reject(`category name ${value} already exists`)
            }
        } ),
      
    ];


}