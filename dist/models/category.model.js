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
exports.CategoryStore = void 0;
const database_1 = __importDefault(require("../database"));
const model_1 = require("./model");
class CategoryStore extends model_1.Model {
    constructor() {
        super(...arguments);
        this.tableName = 'categories';
    }
    create(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const userQuery = yield database_1.default.query(`insert into ${this.tableName} (name) values ( ($1) ) returning *`, [category.name]);
                conn.release();
                return userQuery.rows[0];
            }
            catch (e) {
                throw new Error(`unable to create category with error : ${e.message}`);
            }
        });
    }
    ;
}
exports.CategoryStore = CategoryStore;
