"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
var index_1 = __importDefault(require("./routes/index"));
var app = (0, express_1["default"])();
var address = "0.0.0.0:3000";
app.use(express_1["default"].json());
app.use('/api', index_1["default"]);
app.get('/', function (_, res) {
    res.json({ 'status': 'success' });
});
app.use(error_middleware_1["default"]);
app.use(function (_, res) {
    res.status(404).json({
        message: 'Ohh you are lost, read the API documentation to find your way back home 😂'
    });
});
app.listen(3000, function () {
    console.log("starting app on: ".concat(address));
});
