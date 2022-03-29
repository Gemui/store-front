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
exports.create = exports.getAll = void 0;
const express_validator_1 = require("express-validator");
const category_model_1 = require("../models/category.model");
const categoryStore = new category_model_1.CategoryStore();
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = yield categoryStore.getAll();
        res.json({
            status: 'success',
            data: categoryData || [],
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const categoryData = {
            name: req.body.name,
        };
        const createCategory = yield categoryStore.create(categoryData);
        res.json({
            status: 'success',
            data: createCategory || [],
        });
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
