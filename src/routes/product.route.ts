import { Router } from "express";
import { isAuthenticatedUser } from "../middlewares/auth";
import { getAllProducts } from "../controllers/product.controller";
const router = Router();

router.get("/products", getAllProducts);

export default router;
