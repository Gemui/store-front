import { body,CustomValidator } from "express-validator";
import { CategoryStore } from "../models/category.model";

const categoryStore = new CategoryStore();

export class ProductRequestValidator {

    public validateCreate = [
        body('name', 'userName should be exists and not empty').exists(),
        body('price', 'Price Should be exists and greater than 0 ').exists().bail().custom( (value) => value > 0  ),
        body('category_id','firstName should exists and length betwenn 2 to 5').exists().bail().isInt().bail().custom( async (input) => {
            const isCategoryExists = await categoryStore.getByColumn('id',input);
            if(!isCategoryExists) {
                return Promise.reject(`category_id ${input} not valid`)
            }
        } ),
    ];


}