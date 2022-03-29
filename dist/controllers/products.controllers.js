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
exports.create = exports.getTop = exports.getOne = exports.getAll = void 0;
const express_validator_1 = require("express-validator");
const product_model_1 = require("../models/product.model");
const productStore = new product_model_1.ProductStore();
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = yield productStore.getProductWithCategoryExists(req.body.category_id);
        res.json({
            status: 'success',
            data: productData || []
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = yield productStore.getByColumn('id', req.params.id);
        if (!productData) {
            return res.status(403).json({ status: 'failed', 'message': 'Product not found' });
        }
        res.json({
            status: 'success',
            data: productData || {}
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getOne = getOne;
const getTop = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = yield productStore.topProducts();
        res.json({
            status: 'success',
            data: productData || []
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTop = getTop;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const productData = {
            name: req.body.name,
            category_id: req.body.category_id,
            price: req.body.price,
        };
        const createProduct = yield productStore.create(productData);
        res.json({
            status: 'success',
            data: createProduct || []
        });
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
