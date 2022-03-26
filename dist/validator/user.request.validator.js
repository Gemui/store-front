"use strict";
exports.__esModule = true;
exports.UserRequestValidator = void 0;
var express_validator_1 = require("express-validator");
var UserRequestValidator = /** @class */ (function () {
    function UserRequestValidator() {
        this.validateRegister = [
            (0, express_validator_1.body)('username', 'userName should be exists and not empty').exists(),
            (0, express_validator_1.body)('password', 'Invalid password should be 6 character or more ').exists().bail().isLength({ min: 6 }),
            (0, express_validator_1.body)('firstName', 'firstName should exists and length betwenn 2 to 5').exists().bail().notEmpty().bail().isLength({ min: 2, max: 50 }),
            (0, express_validator_1.body)('lastName').exists().bail().notEmpty().bail().isLength({ min: 2, max: 50 })
        ];
        this.validateLogin = [
            (0, express_validator_1.body)('username', 'userName should be exists and not empty').exists().bail().notEmpty(),
            (0, express_validator_1.body)('password', 'Invalid password should be 6 character or more ').exists().bail().isLength({ min: 6 })
        ];
    }
    return UserRequestValidator;
}());
exports.UserRequestValidator = UserRequestValidator;
