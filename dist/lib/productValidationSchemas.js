"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    title: zod_1.z.string().min(4),
    description: zod_1.z.string().min(4).optional(),
    price: zod_1.z.number().min(0).positive(),
    stock: zod_1.z.number().min(1).positive(),
    category: zod_1.z.string().min(4),
    discountRate: zod_1.z.number().optional(),
    images: zod_1.z.string().array().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    ram: zod_1.z.number().optional(),
    sizes: zod_1.z.array(zod_1.z.string()).optional(),
    colors: zod_1.z
        .array(zod_1.z.object({
        code: zod_1.z.string().optional(),
        value: zod_1.z.string(),
    }))
        .optional(),
});
exports.updateProductSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    price: zod_1.z.number().min(0).positive().optional(),
    stock: zod_1.z.number().min(1).positive().optional(),
    category: zod_1.z.string().min(4).optional(),
    discountRate: zod_1.z.number().optional(),
    images: zod_1.z
        .object({
        indexesToDelete: zod_1.z.array(zod_1.z.number()),
        add: zod_1.z.array(zod_1.z.string()),
    })
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    ram: zod_1.z.number().optional(),
    sizes: zod_1.z.array(zod_1.z.string()).optional(),
    colors: zod_1.z
        .array(zod_1.z.object({
        code: zod_1.z.string().optional(),
        value: zod_1.z.string(),
    }))
        .optional(),
});
