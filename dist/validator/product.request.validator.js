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
exports.ProductRequestValidator = void 0;
const express_validator_1 = require("express-validator");
const category_model_1 = require("../models/category.model");
const categoryStore = new category_model_1.CategoryStore();
class ProductRequestValidator {
    constructor() {
        this.validateCreate = [
            (0, express_validator_1.body)('name', 'name should be exists and not empty').exists(),
            (0, express_validator_1.body)('price', 'Price Should be exists and greater than 0 ')
                .exists()
                .bail()
                .custom((value) => value > 0),
            (0, express_validator_1.body)('category_id', 'firstname should exists and length betwenn 2 to 5')
                .exists()
                .bail()
                .isInt()
                .bail()
                .custom((input) => __awaiter(this, void 0, void 0, function* () {
                const isCategoryExists = yield categoryStore.getByColumn('id', input);
                if (!isCategoryExists) {
                    return Promise.reject(`category_id ${input} not valid`);
                }
            })),
        ];
    }
}
exports.ProductRequestValidator = ProductRequestValidator;
