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
const user_model_1 = require("../../models/user.model");
const server_1 = __importDefault(require("../../server"));
const userModel = new user_model_1.UserStore();
const categoryModel = new category_model_1.CategoryStore();
const request = (0, supertest_1.default)(server_1.default);
describe('Test category Model', () => {
    const user = {
        username: 'username',
        password: 'userpassword',
        firstname: 'first',
        lastname: 'second'
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield userModel.create(user);
        user.id = createdUser.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // clean db
        const connection = yield database_1.default.connect();
        yield connection.query('DELETE FROM users');
        yield connection.query('DELETE FROM categories');
        connection.release();
    }));
    describe('Test Methods exists', () => {
        it('should have method create in category class', () => {
            expect(categoryModel.create).toBeDefined();
        });
    });
    describe('Test Model methods logic', () => {
        it('should create category and return', () => __awaiter(void 0, void 0, void 0, function* () {
            const isCreatedCategory = yield categoryModel.create({ name: 'category-test' });
            expect(isCreatedCategory.name).toEqual('category-test');
        }));
    });
});
