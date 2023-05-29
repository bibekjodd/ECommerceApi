"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const admin_user_controller_1 = require("../controllers/admin.user.controller");
const router = (0, express_1.Router)();
// ---------------------- Admin User Routes ----------------------
router.route("/admin/users").get(auth_1.isAuthenticatedUser, auth_1.isAdmin, admin_user_controller_1.getAllUsers);
router
    .route("/admin/user/:id")
    .get(auth_1.isAuthenticatedUser, auth_1.isAdmin, admin_user_controller_1.getSingleUser)
    .put(auth_1.isAuthenticatedUser, auth_1.isAdmin, admin_user_controller_1.updateUserRole)
    .delete(auth_1.isAuthenticatedUser, auth_1.isAdmin, admin_user_controller_1.deleteUser);
exports.default = router;
