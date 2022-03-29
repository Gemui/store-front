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
exports.completeOrder = exports.create = exports.getOrderDetails = exports.getOne = exports.getOrderByUser = void 0;
const express_validator_1 = require("express-validator");
const orderStatus_enum_1 = __importDefault(require("../enums/orderStatus.enum"));
const order_model_1 = require("../models/order.model");
const orderStore = new order_model_1.OrderStore();
const getOrderByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const orderData = yield orderStore.getUserOrders(Number(req.params.user_id), req.body.order_status);
        if (!orderData) {
            return res.json({ status: 'failed', 'message': 'no orders found for this user id' });
        }
        res.json({
            status: 'success',
            data: orderData
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getOrderByUser = getOrderByUser;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const orderData = yield orderStore.getByColumn('id', req.params.id);
        if (!orderData) {
            return res.status(403).json({ status: 'failed', 'message': 'Order not found' });
        }
        res.json({
            status: 'success',
            data: orderData || {}
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getOne = getOne;
const getOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const orderData = yield orderStore.getOrderDetails(Number(req.params.id));
        res.json({
            status: 'success',
            data: orderData || {}
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getOrderDetails = getOrderDetails;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const orderData = {
            user_id: req.body.user_id,
            status: req.body.price,
        };
        const createdOrder = yield orderStore.create(orderData, req.body.products);
        res.json({
            status: 'success',
            data: createdOrder || []
        });
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const completeOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const orderData = yield orderStore.getByColumn('id', req.params.id);
        if (orderData.status == orderStatus_enum_1.default.completed) {
            return res.status(403).json({
                status: 'failed',
                message: 'order already completed'
            });
        }
        yield orderStore.completeOrder(orderData);
        res.json({
            status: 'success',
            message: 'order completed successfully'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.completeOrder = completeOrder;
