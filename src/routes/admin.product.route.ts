import express from "express";
import { isAuthenticatedUser, isAdmin } from "../middlewares/auth";
import {
  createProduct,
  deleteProduct,
  getProductDetails,
  updateProduct,
} from "../controllers/admin.product.controller";

const router = express.Router();

// ---------------------- Admin Product Routes ----------------------

router
  .route("/admin/product")
  .post(isAuthenticatedUser, isAdmin, createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, isAdmin, updateProduct)
  .delete(isAuthenticatedUser, isAdmin, deleteProduct)
  .get(isAuthenticatedUser, isAdmin, getProductDetails);

export default router;
