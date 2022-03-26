"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var express_1 = require("express");
var controllers = __importStar(require("../../controllers/orders.controllers"));
var authenticate_1 = require("../../middleware/authenticate");
var order_request_validator_1 = require("../../validator/order.request.validator");
var routes = (0, express_1.Router)();
var validator = new order_request_validator_1.OrderRequestValidator();
// routes.route('/').get(controllers.getAll);
routes.route('/:user_id').get(authenticate_1.AuthenticatedUser, controllers.getOrderByUser);
routes.route('/create').post(authenticate_1.AuthenticatedUser, validator.validateCreate, controllers.create);
routes.route('/:id/complete').post(authenticate_1.AuthenticatedUser, validator.validateComplete, controllers.completeOrder);
exports["default"] = routes;