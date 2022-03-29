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
const supertest_1 = __importDefault(require("supertest"));
const database_1 = __importDefault(require("../../database"));
const orderStatus_enum_1 = __importDefault(require("../../enums/orderStatus.enum"));
const category_model_1 = require("../../models/category.model");
const order_model_1 = require("../../models/order.model");
const product_model_1 = require("../../models/product.model");
const user_model_1 = require("../../models/user.model");
const server_1 = __importDefault(require("../../server"));
const userModel = new user_model_1.UserStore();
const categoryModel = new category_model_1.CategoryStore();
const productModel = new product_model_1.ProductStore();
const orderModel = new order_model_1.OrderStore();
const request = (0, supertest_1.default)(server_1.default);
describe('Test category Model', () => {
    const user = {
        username: 'username',
        password: 'userpassword',
        firstname: 'first',
        lastname: 'second'
    };
    const category = {
        name: 'category-test',
    };
    const product = {
        name: 'product-test',
        price: 15,
    };
    let orderID;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield userModel.create(user);
        user.id = createdUser.id;
        const createdCategory = yield categoryModel.create(category);
        category.id = createdCategory.id;
        product.category_id = Number(category.id);
        const createdProduct = yield productModel.create(product);
        product.id = createdProduct.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // clean db
        const connection = yield database_1.default.connect();
        yield connection.query('DELETE FROM users');
        yield connection.query('DELETE FROM categories');
        yield connection.query('DELETE FROM products');
        yield connection.query('DELETE FROM orders');
        connection.release();
    }));
    describe('Test Methods exists', () => {
        it('should have method create in order class', () => {
            expect(orderModel.create).toBeDefined();
        });
        it('should have method getProductWithCategoryExists in order class', () => {
            expect(orderModel.completeOrder).toBeDefined();
        });
        it('should have method getUserOrders in order class', () => {
            expect(orderModel.getUserOrders).toBeDefined();
        });
        it('should have method getOrderDetails in order class', () => {
            expect(orderModel.getOrderDetails).toBeDefined();
        });
    });
    describe('Test Model methods logic', () => {
        it('should create category and return category info', () => __awaiter(void 0, void 0, void 0, function* () {
            const isCreatedOrder = yield orderModel.create({ user_id: Number(user.id), status: orderStatus_enum_1.default.active }, [{
                    product_id: Number(product.id),
                    product_price: product.price,
                    product_quantity: 5
                }]);
            expect(isCreatedOrder.user_id).toEqual(Number(user.id));
            expect(isCreatedOrder.status).toEqual(orderStatus_enum_1.default.active);
            if (isCreatedOrder.orderProducts) {
                expect(isCreatedOrder.orderProducts[0].order_id).toEqual(Number(isCreatedOrder.id));
                expect(isCreatedOrder.orderProducts[0].product_id).toEqual(Number(product.id));
                expect(isCreatedOrder.orderProducts[0].product_price).toEqual(product.price);
                expect(isCreatedOrder.orderProducts[0].product_quantity).toEqual(5);
            }
            orderID = Number(isCreatedOrder.id);
        }));
        it('should complete order ', () => __awaiter(void 0, void 0, void 0, function* () {
            const completeOrder = yield orderModel.completeOrder(orderID);
            const isCompletedOrder = yield orderModel.getByColumn('id', orderID);
            expect(isCompletedOrder.status).toEqual(orderStatus_enum_1.default.completed);
        }));
        it('should return all user orders by user_id', () => __awaiter(void 0, void 0, void 0, function* () {
            const isUserOrders = yield orderModel.getUserOrders(Number(user.id));
            expect(isUserOrders.length).toEqual(1);
        }));
    });
});
