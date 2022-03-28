"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRequestValidator = void 0;
const express_validator_1 = require("express-validator");
class UserRequestValidator {
    constructor() {
        this.validateRegister = [
            (0, express_validator_1.body)('username', 'userName should be exists and not empty').exists(),
            (0, express_validator_1.body)('password', 'Invalid password should be 6 character or more').exists().bail().isLength({ min: 6 }),
            (0, express_validator_1.body)('firstName', 'firstName should exists and length betwenn 2 to 5').exists().bail().notEmpty().bail().isLength({ min: 2, max: 50 }),
            (0, express_validator_1.body)('lastName').exists().bail().notEmpty().bail().isLength({ min: 2, max: 50 })
        ];
        this.validateLogin = [
            (0, express_validator_1.body)('username', 'userName should be exists and not empty').exists().bail().notEmpty(),
            (0, express_validator_1.body)('password', 'Invalid password should be 6 character or more').exists().bail().isLength({ min: 6 })
        ];
    }
}
exports.UserRequestValidator = UserRequestValidator;
