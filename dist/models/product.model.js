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
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
const model_1 = require("./model");
class ProductStore extends model_1.Model {
    constructor() {
        super(...arguments);
        this.tableName = 'products';
    }
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const userQuery = yield database_1.default.query(`insert into ${this.tableName}
             (name, category_id, price) values ( ($1) ,($2), ($3) ) returning *`, [product.name, product.category_id, product.price]);
                conn.release();
                return userQuery.rows[0];
            }
            catch (e) {
                throw new Error(`unable to create product with error : ${e.message}`);
            }
        });
    }
    ;
    getProductWithCategoryExists(category_id = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                let productQuery = `select * from ${this.tableName} `;
                const productData = [];
                let userQuery;
                if (category_id) {
                    productQuery += 'where category_id = ($1)';
                    console.log(productQuery);
                    userQuery = yield database_1.default.query(productQuery, [category_id]);
                }
                else {
                    userQuery = yield database_1.default.query(productQuery);
                }
                conn.release();
                return userQuery.rows;
            }
            catch (e) {
                throw new Error(`unable to create product with error : ${e.message}`);
            }
        });
    }
    ;
    topProducts(limit = 5) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const userQuery = yield database_1.default.query(`select p.*, sum(op.product_quantity) number_of_sale from  order_products op
                 inner join products p on op.product_id = p.id
                 group by p.id order by number_of_sale desc limit ($1)`, [limit]);
                conn.release();
                return userQuery.rows;
            }
            catch (e) {
                throw new Error(`unable to get top product with error : ${e.message}`);
            }
        });
    }
    ;
}
exports.ProductStore = ProductStore;
