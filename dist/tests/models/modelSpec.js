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
const model_1 = require("../../models/model");
const user_model_1 = require("../../models/user.model");
const server_1 = __importDefault(require("../../server"));
class TestModel extends model_1.Model {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
}
const userModel = new user_model_1.UserStore();
const request = (0, supertest_1.default)(server_1.default);
const testModel = new TestModel();
describe('Test Abstract Model', () => {
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
        connection.release();
    }));
    describe('Test Methods exists', () => {
        it('should have method getAll in model class', () => {
            expect(testModel.getAll).toBeDefined();
        });
        it('should have method getByColumn in model class', () => {
            expect(testModel.getByColumn).toBeDefined();
        });
        it('should have method getManyByColumn in model class', () => {
            expect(testModel.getManyByColumn).toBeDefined();
        });
    });
    describe('Test Model methods logic', () => {
        it('should have method getAll as return many of child class', () => __awaiter(void 0, void 0, void 0, function* () {
            const isGetAll = yield testModel.getAll();
            expect(isGetAll.length).toEqual(1);
            expect(isGetAll[0].id).toEqual(user.id);
            expect(isGetAll[0].username).toEqual(user.username);
            expect(isGetAll[0].firstname).toEqual(user.firstname);
            expect(isGetAll[0].lastname).toEqual(user.lastname);
        }));
        it('should have method getByColumn as return one recored of child class ', () => __awaiter(void 0, void 0, void 0, function* () {
            const isGetByColumn = yield testModel.getByColumn('id', Number(user.id));
            expect(isGetByColumn.id).toEqual(user.id);
            expect(isGetByColumn.username).toEqual(user.username);
            expect(isGetByColumn.firstname).toEqual(user.firstname);
            expect(isGetByColumn.lastname).toEqual(user.lastname);
        }));
        it('should have method getManyByColumn as return many recored of child class ', () => __awaiter(void 0, void 0, void 0, function* () {
            const isGetManyByColumn = yield testModel.getManyByColumn('id', Number(user.id));
            // expect(isGetManyByColumn[0]).toEqual(user);
            expect(isGetManyByColumn[0].id).toEqual(user.id);
            expect(isGetManyByColumn[0].username).toEqual(user.username);
            expect(isGetManyByColumn[0].firstname).toEqual(user.firstname);
            expect(isGetManyByColumn[0].lastname).toEqual(user.lastname);
            expect(isGetManyByColumn.length).toEqual(1);
        }));
    });
});
