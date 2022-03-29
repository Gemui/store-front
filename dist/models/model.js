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
exports.Model = void 0;
const database_1 = __importDefault(require("../database"));
class Model {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const userQuery = yield database_1.default.query(`select * from  ${this.tableName}`);
                conn.release();
                if (userQuery.rows.length) {
                    return userQuery.rows;
                }
                return null;
            }
            catch (e) {
                throw new Error(`unable to select from ${this.tableName} using getAll  error : ${e.message}`);
            }
        });
    }
    getByColumn(column, value, operator = '=') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const userQuery = yield database_1.default.query(`select * from  ${this.tableName} where ${column} ${operator} ($1)`, [value]);
                conn.release();
                if (userQuery.rows.length) {
                    return userQuery.rows[0];
                }
                return null;
            }
            catch (e) {
                throw new Error(`unable to getByColumn from ${this.tableName} using getByColumn  error : ${e.message}`);
            }
        });
    }
    getManyByColumn(column, value, operator = '=') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const userQuery = yield database_1.default.query(`select * from  ${this.tableName} where ${column} ${operator} ($1)`, [value]);
                conn.release();
                if (userQuery.rows.length) {
                    return userQuery.rows;
                }
                return null;
            }
            catch (e) {
                throw new Error(`unable to getByColumn from ${this.tableName} using getByColumn  error : ${e.message}`);
            }
        });
    }
}
exports.Model = Model;
