import { body } from "express-validator";

export class UserRequestValidator {

    public validateRegister = [
        body('username', 'userName should be exists and not empty').exists(),
        body('password', 'Invalid password should be 6 character or more ').exists().bail().isLength({ min : 6}),
        body('firstName','firstName should exists and length betwenn 2 to 5').exists().bail().notEmpty().bail() .isLength({min: 2 , max :50}),
        body('lastName').exists().bail().notEmpty().bail().isLength({min: 2 , max :50})
    ];


    public validateLogin = [
        body('username', 'userName should be exists and not empty').exists().bail().notEmpty(),
        body('password', 'Invalid password should be 6 character or more ').exists().bail().isLength({ min : 6})
    ];

}