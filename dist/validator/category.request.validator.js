"use strict";
exports.__esModule = true;
exports.CategoryRequestValidator = void 0;
var express_validator_1 = require("express-validator");
var CategoryRequestValidator = /** @class */ (function () {
    function CategoryRequestValidator() {
        this.validateCreate = [
            (0, express_validator_1.body)('name', 'category name should be exists and not empty').exists().bail().notEmpty(),
        ];
    }
    return CategoryRequestValidator;
}());
exports.CategoryRequestValidator = CategoryRequestValidator;
