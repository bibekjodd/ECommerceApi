"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.route("/admin/users").get(auth_1.isAuthenticatedUser, auth_1.isAdmin, adminController_1.getAllUser);
router
    .route("/admin/user/:id")
    .get(auth_1.isAuthenticatedUser, auth_1.isAdmin, adminController_1.getSingleUser)
    .put(auth_1.isAuthenticatedUser, auth_1.isAdmin, adminController_1.updateUserRole)
    .delete(auth_1.isAuthenticatedUser, auth_1.isAdmin, adminController_1.deleteUser);
exports.default = router;
