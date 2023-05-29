"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const admin_product_controller_1 = require("../controllers/admin.product.controller");
const router = express_1.default.Router();
// ---------------------- Admin Product Routes ----------------------
router
    .route("/admin/product")
    .post(auth_1.isAuthenticatedUser, auth_1.isAdmin, admin_product_controller_1.createProduct);
router
    .route("/admin/product/:id")
    .put(auth_1.isAuthenticatedUser, auth_1.isAdmin, admin_product_controller_1.updateProduct)
    .delete(auth_1.isAuthenticatedUser, auth_1.isAdmin, admin_product_controller_1.deleteProduct)
    .get(auth_1.isAuthenticatedUser, auth_1.isAdmin, admin_product_controller_1.getProductDetails);
exports.default = router;
