import { Router } from "express";
import {
  getAllProducts,
  hotOffers,
  salesProducts,
} from "../controllers/product.controller";
const router = Router();

router.get("/products", getAllProducts);
router.get("/sales", salesProducts);
router.get("/hotoffers", hotOffers);

export default router;
