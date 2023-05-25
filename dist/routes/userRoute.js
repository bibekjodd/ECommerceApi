"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.route("/register").post(userController_1.registerUser);
router.route("/login").post(userController_1.loginUser);
router
    .route("/me")
    .get(auth_1.isAuthenticatedUser, userController_1.getUserDetails)
    .put(auth_1.isAuthenticatedUser, userController_1.updateProfile);
router.route("/password/forgot").post(userController_1.forgotPassword);
router.route("/password/reset/:token").put(userController_1.resetPassword);
router.route("/logout").get(userController_1.logout);
router.route("/password/update").put(auth_1.isAuthenticatedUser, userController_1.updatePassword);
exports.default = router;
