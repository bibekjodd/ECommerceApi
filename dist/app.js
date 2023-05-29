"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("colors");
const appConfig_1 = require("./config/appConfig");
const notFound_1 = require("./middlewares/notFound");
const error_1 = require("./middlewares/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const product_review_route_1 = __importDefault(require("./routes/product.review.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const admin_user_route_1 = __importDefault(require("./routes/admin.user.route"));
const admin_product_route_1 = __importDefault(require("./routes/admin.product.route"));
const database_1 = __importDefault(require("./config/database"));
// -------- initial config for api --------
(0, appConfig_1.initialConfig)(app);
(0, database_1.default)();
// -------- routes --------
app.use("/api/v1", user_route_1.default);
app.use("/api/v1", product_route_1.default);
app.use("/api/v1", product_review_route_1.default);
app.use("/api/v1", admin_route_1.default);
app.use("/api/v1", admin_user_route_1.default);
app.use("/api/v1", admin_product_route_1.default);
app.use(notFound_1.notFound);
app.use(error_1.error);
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT || 5000}`.yellow);
});
