"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.route("/register").post(user_controller_1.registerUser);
router.route("/login").post(user_controller_1.loginUser);
router
    .route("/me")
    .get(auth_1.isAuthenticatedUser, user_controller_1.getUserDetails)
    .put(auth_1.isAuthenticatedUser, user_controller_1.updateProfile)
    .delete(auth_1.isAuthenticatedUser, user_controller_1.deleteProfile);
router.route("/password/forgot").post(user_controller_1.forgotPassword);
router.route("/password/reset/:token").put(user_controller_1.resetPassword);
router.route("/logout").get(user_controller_1.logout);
router.route("/password/update").put(auth_1.isAuthenticatedUser, user_controller_1.updatePassword);
exports.default = router;
