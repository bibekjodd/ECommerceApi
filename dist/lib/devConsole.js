"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function devConsole(...args) {
    if (process.env.NODE_ENV === "development") {
        console.log(args.join(" "));
    }
}
exports.default = devConsole;
