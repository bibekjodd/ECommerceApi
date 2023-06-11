"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory field"],
        trim: true,
        minLength: [4, "Name must be at least 4 characters"],
        maxLength: [30, "Name should not exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is mandatory field"],
        minLength: [10, "Email must be at least 4 characters"],
        maxLength: [30, "Email should not exceed 30 characters"],
        validate: [validator_1.default.isEmail, "Must provide valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is mandatory field"],
        select: false,
        minLength: [6, "Password must be at least 6 characters"],
        trim: true,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    role: { type: String, default: "user" },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await bcryptjs_1.default.hash(this.password || "", 10);
    next();
});
userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcryptjs_1.default.compare(password, this.password);
    return isMatch;
};
userSchema.methods.generateToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
/**
 * generates token of 20 bytes that expires after 15 minutes don't forget tosave after generating token
 */
userSchema.methods.getResetPasswordToken = function () {
    const token = crypto_1.default.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000;
    return token;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
