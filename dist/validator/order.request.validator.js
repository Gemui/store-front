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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRequestValidator = void 0;
const express_validator_1 = require("express-validator");
const orderStatus_enum_1 = __importDefault(require("../enums/orderStatus.enum"));
const order_model_1 = require("../models/order.model");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
const productStore = new product_model_1.ProductStore();
const userStore = new user_model_1.UserStore();
const orderStore = new order_model_1.OrderStore();
class OrderRequestValidator {
    constructor() {
        this.validateCreate = [
            (0, express_validator_1.body)('user_id', 'user_id should exists and valid')
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
            (0, express_validator_1.body)('products', 'products should be an array').isArray(),
            (0, express_validator_1.check)('products.*.product_id', 'product_id should be int and exists')
                .isInt()
                .bail()
                .custom((value) => __awaiter(this, void 0, void 0, function* () {
                const isProductExists = yield productStore.getByColumn('id', value);
                if (!isProductExists) {
                    return Promise.reject(`product_id ${value} not valid`);
                }
            })),
            (0, express_validator_1.check)('products.*.product_quantity', 'product_quantity greater than 0 and less than 10000')
                .exists()
                .bail()
                .isNumeric()
                .bail()
                .custom((value) => value > 0 && value < 10000),
        ];
        this.validateOrderParam = [
            (0, express_validator_1.param)('id')
                .exists()
                .bail()
                .notEmpty()
                .bail()
                .custom((value) => __awaiter(this, void 0, void 0, function* () {
                const isOrderExists = yield orderStore.getByColumn('id', value);
                if (!isOrderExists) {
                    return Promise.reject(`order_id ${value} not valid`);
                }
            })),
        ];
        this.validateUserOrders = [
            (0, express_validator_1.param)('user_id')
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
            (0, express_validator_1.check)('order_status').custom((value) => {
                if (value && !Object.values(orderStatus_enum_1.default).includes(value)) {
                    return false;
                }
                return true;
            }),
        ];
    }
}
exports.OrderRequestValidator = OrderRequestValidator;
