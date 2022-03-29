"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRequestValidator = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = require("../models/user.model");
const userStore = new user_model_1.UserStore();
class UserRequestValidator {
    constructor() {
        this.validateRegister = [
            (0, express_validator_1.body)('username', 'userName should be exists and not empty').exists(),
            (0, express_validator_1.body)('password', 'Invalid password should be 6 character or more')
                .exists()
                .bail()
                .isLength({ min: 6 }),
            (0, express_validator_1.body)('firstname', 'firstname should exists and length betwenn 2 to 5')
                .exists()
                .bail()
                .notEmpty()
                .bail()
                .isLength({ min: 2, max: 50 }),
            (0, express_validator_1.body)('lastname')
                .exists()
                .bail()
                .notEmpty()
                .bail()
                .isLength({ min: 2, max: 50 }),
        ];
        this.validateLogin = [
            (0, express_validator_1.body)('username', 'userName should be exists and not empty')
                .exists()
                .bail()
                .notEmpty(),
            (0, express_validator_1.body)('password', 'Invalid password should be 6 character or more')
                .exists()
                .bail()
                .isLength({ min: 6 }),
        ];
        this.validateUserId = [
            (0, express_validator_1.param)('id')
                .exists()
                .bail()
                .notEmpty()
                .bail()
                .custom((value) => __awaiter(this, void 0, void 0, function* () {
                const isUserExists = yield userStore.getByColumn('id', value);
                if (!isUserExists) {
                    return Promise.reject(`user_id ${value} not valid`);
                }
            })),
        ];
    }
}
exports.UserRequestValidator = UserRequestValidator;
