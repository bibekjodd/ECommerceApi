"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const productBody = zod_1.z.object({
    title: zod_1.z.string().min(4),
    description: zod_1.z.string().min(4).optional(),
    price: zod_1.z.number().min(0).positive(),
    stock: zod_1.z.number().min(1).positive(),
    category: zod_1.z.string().min(4),
    images: zod_1.z.string().array().optional(),
});
function validateProduct(product) {
    try {
        productBody.parse(product);
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.default = validateProduct;
