"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
router.get("/products", product_controller_1.getAllProducts);
router.get("/sales", product_controller_1.salesProducts);
router.get("/hotoffers", product_controller_1.hotOffers);
exports.default = router;
