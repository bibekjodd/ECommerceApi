"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const product_review_controller_1 = require("../controllers/product.review.controller");
const router = (0, express_1.Router)();
router
    .route("/review")
    .put(auth_1.isAuthenticatedUser, product_review_controller_1.createOrUpdateReview)
    .get(product_review_controller_1.getProductReviews)
    .delete(auth_1.isAuthenticatedUser, product_review_controller_1.deleteProductReview);
exports.default = router;
