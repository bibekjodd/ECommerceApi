"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProduct = exports.validateProduct = void 0;
const errorHandler_1 = require("./errorHandler");
const productValidationSchemas_1 = require("./productValidationSchemas");
function validateProduct(product) {
    try {
        productValidationSchemas_1.productSchema.parse(product);
    }
    catch (error) {
        throw new errorHandler_1.ErrorHandler("Product validation failed", 400);
    }
}
exports.validateProduct = validateProduct;
function validateUpdateProduct(product) {
    try {
        productValidationSchemas_1.updateProductSchema.parse(product);
    }
    catch (error) {
        throw new errorHandler_1.ErrorHandler("Product validation failed", 400);
    }
}
exports.validateUpdateProduct = validateUpdateProduct;
