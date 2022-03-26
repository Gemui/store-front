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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.completeOrder = exports.create = exports.getOne = exports.getOrderByUser = void 0;
var express_validator_1 = require("express-validator");
var orderStatus_enum_1 = __importDefault(require("../enums/orderStatus.enum"));
var order_model_1 = require("../models/order.model");
var orderStore = new order_model_1.OrderStore();
var getOrderByUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderData, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orderStore.getManyByColumn('user_id', req.params.user_id)];
            case 1:
                orderData = _a.sent();
                if (!orderData) {
                    return [2 /*return*/, res.json({ status: 'failed', 'message': 'no orders found for this user id' })];
                }
                res.json({
                    status: 'success',
                    data: orderData
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOrderByUser = getOrderByUser;
var getOne = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderData, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orderStore.getByColumn('id', req.params.id)];
            case 1:
                orderData = _a.sent();
                if (!orderData) {
                    return [2 /*return*/, res.status(403).json({ status: 'failed', 'message': 'Order not found' })];
                }
                res.json({
                    status: 'success',
                    data: orderData || {}
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOne = getOne;
var create = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, orderData, createdOrder, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(422).json({ errors: errors.array() })];
                }
                orderData = {
                    user_id: req.body.user_id,
                    status: req.body.price
                };
                return [4 /*yield*/, orderStore.create(orderData, req.body.products)];
            case 1:
                createdOrder = _a.sent();
                console.log(2, createdOrder);
                res.json({
                    status: 'success',
                    data: createdOrder || []
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.create = create;
var completeOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, orderData, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(422).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, orderStore.getByColumn('id', req.params.id)];
            case 1:
                orderData = _a.sent();
                if (orderData.status == orderStatus_enum_1["default"].completed) {
                    return [2 /*return*/, res.status(403).json({
                            status: 'failed',
                            message: 'order already completed'
                        })];
                }
                return [4 /*yield*/, orderStore.completeOrder(orderData)];
            case 2:
                _a.sent();
                res.json({
                    status: 'success',
                    message: 'order completed successfully'
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.completeOrder = completeOrder;
