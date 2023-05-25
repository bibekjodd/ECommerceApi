import express from "express";
import { isAuthenticatedUser, isAdmin } from "../middlewares/auth";
import {
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUserRole,
} from "../controllers/adminController";
const router = express.Router();

router.route("/admin/users").get(isAuthenticatedUser, isAdmin, getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, isAdmin, getSingleUser)
  .put(isAuthenticatedUser, isAdmin, updateUserRole)
  .delete(isAuthenticatedUser, isAdmin, deleteUser);

export default router;
