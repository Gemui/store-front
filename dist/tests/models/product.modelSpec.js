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
const category_model_1 = require("../../models/category.model");
const product_model_1 = require("../../models/product.model");
const user_model_1 = require("../../models/user.model");
const server_1 = __importDefault(require("../../server"));
const userModel = new user_model_1.UserStore();
const categoryModel = new category_model_1.CategoryStore();
const productModel = new product_model_1.ProductStore();
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
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield userModel.create(user);
        user.id = createdUser.id;
        const createdCategory = yield categoryModel.create(category);
        category.id = createdCategory.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // clean db
        const connection = yield database_1.default.connect();
        yield connection.query('DELETE FROM users');
        yield connection.query('DELETE FROM categories');
        yield connection.query('DELETE FROM products');
        connection.release();
    }));
    describe('Test Methods exists', () => {
        it('should have method create in category class', () => {
            expect(productModel.create).toBeDefined();
        });
        it('should have method getProductWithCategoryExists in category class', () => {
            expect(productModel.getProductWithCategoryExists).toBeDefined();
        });
        it('should have method topProducts in category class', () => {
            expect(productModel.topProducts).toBeDefined();
        });
    });
    describe('Test Model methods logic', () => {
        it('create should create category and return category info', () => __awaiter(void 0, void 0, void 0, function* () {
            const isCreatedProduct = yield productModel.create({
                name: 'product-test',
                category_id: Number(category.id),
                price: 15,
            });
            expect(isCreatedProduct.name).toEqual('product-test');
        }));
        it('getProductWithCategoryExists should get productcs by category id ', () => __awaiter(void 0, void 0, void 0, function* () {
            const isCreatedProduct = yield productModel.getProductWithCategoryExists(category.id);
            expect(isCreatedProduct[0].name).toEqual('product-test');
            expect(isCreatedProduct[0].price).toEqual(15);
            expect(isCreatedProduct[0].category_id).toEqual(Number(category.id));
        }));
        it('topProducts should return empty with topProducts', () => __awaiter(void 0, void 0, void 0, function* () {
            const isCreatedProduct = yield productModel.topProducts(category.id);
            expect(isCreatedProduct.length).toEqual(0);
        }));
    });
});
