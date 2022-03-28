"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
const address = "0.0.0.0:3000";
app.use(express_1.default.json());
app.use('/api', index_1.default);
app.get('/', function (_, res) {
    res.json({ 'status': 'success' });
});
app.use(error_middleware_1.default);
app.use((_, res) => {
    res.status(404).json({
        message: 'Ohh you are lost, read the API documentation to find your way back home 😂',
    });
});
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
