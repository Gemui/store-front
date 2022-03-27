"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.OrderStore = void 0;
var database_1 = __importDefault(require("../database"));
var orderStatus_enum_1 = __importDefault(require("../enums/orderStatus.enum"));
var model_1 = require("./model");
var product_model_1 = require("./product.model");
var productStore = new product_model_1.ProductStore();
var OrderStore = /** @class */ (function (_super) {
    __extends(OrderStore, _super);
    function OrderStore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tableName = 'orders';
        return _this;
    }
    OrderStore.prototype.create = function (order, orderProducts) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, orderQuery, orderData, createdProducts, i, orderProduct, databaseProduct, insertedProduct, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        console.log(order);
                        return [4 /*yield*/, database_1["default"].query("insert into ".concat(this.tableName, "\n             (user_id) values ( ($1) ) returning *"), [order.user_id])];
                    case 2:
                        orderQuery = _a.sent();
                        orderData = orderQuery.rows[0];
                        createdProducts = [];
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < orderProducts.length)) return [3 /*break*/, 7];
                        orderProduct = orderProducts[i];
                        return [4 /*yield*/, productStore.getByColumn('id', orderProduct.product_id)];
                    case 4:
                        databaseProduct = _a.sent();
                        return [4 /*yield*/, database_1["default"].
                                query('insert into order_products (order_id, product_id, product_quantity, product_price) values ( ($1), ($2), ($3), ($4) ) returning *', [orderData.id, orderProduct.product_id, orderProduct.product_quantity, databaseProduct.price])];
                    case 5:
                        insertedProduct = (_a.sent()).rows;
                        createdProducts.push(insertedProduct);
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7:
                        conn.release();
                        orderData['orderProducts'] = createdProducts;
                        console.log(orderData);
                        return [2 /*return*/, orderData];
                    case 8:
                        e_1 = _a.sent();
                        throw new Error("unable to create order with error : ".concat(e_1.message));
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ;
    OrderStore.prototype.completeOrder = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, database_1["default"].query("update ".concat(this.tableName, " set status =  ($1) where id = ($2)"), [orderStatus_enum_1["default"].completed, order.id])];
                    case 2:
                        _a.sent();
                        conn.release();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        throw new Error("unable to complete order with error : ".concat(e_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    OrderStore.prototype.getUserOrders = function (user_id, status) {
        if (status === void 0) { status = null; }
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryData, clientQuery, userOrders, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        queryData = [user_id];
                        clientQuery = "select * from orders where user_id = ($1)";
                        if (status) {
                            clientQuery += 'and status = ($2)';
                            queryData.push(status);
                        }
                        return [4 /*yield*/, database_1["default"].query(clientQuery, queryData)];
                    case 2:
                        userOrders = _a.sent();
                        conn.release();
                        return [2 /*return*/, userOrders.rows];
                    case 3:
                        e_3 = _a.sent();
                        throw new Error("unable to getUserOrders with error : ".concat(e_3.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    OrderStore.prototype.getOrderDetails = function (order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, order, _a, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _b.sent();
                        return [4 /*yield*/, this.getByColumn('id', order_id)];
                    case 2:
                        order = _b.sent();
                        _a = order;
                        return [4 /*yield*/, conn.query('select * from order_products where order_id = ($1)', [order.id])];
                    case 3:
                        _a.orderProducts = (_b.sent()).rows;
                        conn.release();
                        return [2 /*return*/, order];
                    case 4:
                        e_4 = _b.sent();
                        throw new Error("unable to getOrderDetails with error : ".concat(e_4.message));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return OrderStore;
}(model_1.Model));
exports.OrderStore = OrderStore;
