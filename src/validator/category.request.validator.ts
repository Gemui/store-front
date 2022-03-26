import { body, checkSchema } from "express-validator";

export class CategoryRequestValidator {

    public validateCreate = [
        body('name', 'category name should be exists and not empty').exists().bail().notEmpty(),
      
    ];


}