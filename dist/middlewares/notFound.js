"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res) => {
    res.status(404).json({ message: "The requested url is not found" });
};
exports.notFound = notFound;
