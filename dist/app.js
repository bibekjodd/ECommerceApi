"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("colors");
const appConfig_1 = require("./config/appConfig");
const database_1 = require("./config/database");
const mongoose_1 = __importDefault(require("mongoose"));
const notFound_1 = require("./middlewares/notFound");
const error_1 = require("./middlewares/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
// -------- initial config for api --------
(0, appConfig_1.initialConfig)(app);
(0, database_1.connectDatabase)();
// -------- routes --------
app.use("/api/v1", user_route_1.default);
app.use("/api/v1", admin_route_1.default);
// -------- database configuration --------
mongoose_1.default.connection.once("open", () => {
    global.databaseConnected = true;
});
mongoose_1.default.connection.once("error", () => {
    global.databaseConnected = false;
});
app.use(notFound_1.notFound);
app.use(error_1.error);
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT || 5000}`.yellow);
});
